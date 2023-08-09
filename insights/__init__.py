import json
import os
import random
import string
import sys
from urllib.parse import parse_qs

from flask import (
    Flask,
    abort,
    render_template,
    url_for,
    request,
    redirect,
    flash,
    Response,
)
from flask_caching import Cache


__version__ = "0.1.0"


def create_app():
    def secret_key():
        if os.environ.get("SECRET_KEY"):
            return os.environ.get("SECRET_KEY")

        print(
            "Warning: Using self generated random key. Set environment var SECRET_KEY",
            file=sys.stderr,
        )
        return "".join(random.choice(string.ascii_lowercase) for i in range(40))

    database_url = os.environ.get("DATABASE_URL", "")

    with open("config/" + os.environ.get("INSIGHTS_CONFIG", "main") + ".json") as f:
        config_data = json.load(f)

    # dokku uses postgres:// and sqlalchamy requires postgresql:// fix the url here
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://")

    app = Flask(__name__)
    app.config.from_mapping(
        DATASTORE_URL=os.environ.get("DATASTORE_URL"),
        SQLALCHEMY_DATABASE_URI=database_url,
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        MAPBOX_ACCESS_TOKEN=os.environ.get("MAPBOX_ACCESS_TOKEN"),
        SECRET_KEY=secret_key(),
        # https://flask-caching.readthedocs.io/en/latest/index.html#built-in-cache-backends
        CACHE_TYPE=os.environ.get("CACHE_TYPE", "FileSystemCache"),
        CACHE_DIR=os.environ.get("CACHE_DIR", "/tmp/insights-cac"),
        CACHE_DEFAULT_TIMEOUT=os.environ.get("CACHE_TIMEOUT", 0),
        INSIGHTS_CONFIG=config_data,
    )

    # Make sure that the tojson filter function does *not* use the jinja default of sorting the
    # keys. This is especially important as the key order needs to be maintained
    # for graph labels. (bin_labels)
    app.jinja_env.policies["json.dumps_kwargs"] = {"sort_keys": False}

    cache = Cache(app)

    @app.context_processor
    def inject_nav():
        return dict(
            nav={
                "360Insights": url_for("data"),
                "About": url_for("about"),
                "GrantNav": "https://grantnav.threesixtygiving.org/",
            }
        )

    @app.route("/about")
    def about():
        return render_template("about.html.j2")

    @app.route("/")
    def data():
        return render_template(
            "data-display.vue.j2",
            context={
                "title": "Fixme",
                "subtile": "fixme",
                "config": config_data,
            },
        )

    return app
