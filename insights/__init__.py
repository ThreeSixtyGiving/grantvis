import json
import os
import random
import string
import sys

from flask import (
    Flask,
    render_template,
    url_for,
)

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

    with open("config/" + os.environ.get("INSIGHTS_CONFIG", "main") + ".json") as f:
        config_data = json.load(f)

    app = Flask(__name__)
    app.config.from_mapping(
        MAPBOX_ACCESS_TOKEN=os.environ.get("MAPBOX_ACCESS_TOKEN"),
        SECRET_KEY=secret_key(),
        INSIGHTS_CONFIG=config_data,
    )

    @app.context_processor
    def inject_nav():
        return dict(
            nav={
                "360Insights": url_for("data"),
                "About": url_for("about"),
                "GrantNav": "https://grantnav.threesixtygiving.org/",
            },
            debug=app.config["DEBUG"],
        )

    @app.route("/about")
    def about():
        return render_template("about.html.j2")

    @app.route("/")
    def data():
        return render_template(
            "data-display.vue.j2",
            context={
                "config": config_data,
            },
        )

    return app
