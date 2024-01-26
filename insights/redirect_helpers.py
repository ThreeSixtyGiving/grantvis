from flask import (
    url_for,
    redirect,
)


def funders(request):
    """Rewrites query param funders to fundingOrganization for legacy 2024"""
    newargs = request.args.copy()
    funders = newargs.poplist("funders")
    newargs.setlist("fundingOrganization", funders)

    # Using flat=False to preserve multi keys
    # see https://github.com/pallets/flask/issues/4893#issuecomment-1335957018
    return redirect(url_for("data", **newargs.to_dict(flat=False)))
