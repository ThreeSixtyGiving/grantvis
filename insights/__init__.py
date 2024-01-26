import json
import os
import random
import string
import sys
import insights.redirect_helpers as redirect_helpers

from flask import (
    Flask,
    render_template,
    url_for,
    request,
    redirect,
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
        GRANTNAV_BASE_URL=os.environ.get(
            "GRANTNAV_BASE_URL", "https://grantnav.threesixtygiving.org"
        ),
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
        # Check for legacy url 2024
        if request.args.get("funders"):
            return redirect_helpers.funders(request)

        return render_template(
            "data-display.vue.j2",
            context={
                "config": config_data,
            },
        )

    # Legacy redirect 2024
    @app.route("/data")
    def legacy_data():
        if request.args.get("funders"):
            return redirect_helpers.funders(request)
        else:
            return redirect("/")

    # Legacy redirect 2024
    @app.route("/file/<file_id>")
    def legacy_file(file_id):
        return redirect("/")

    return app
