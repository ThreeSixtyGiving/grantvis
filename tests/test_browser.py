import os

import chromedriver_autoinstaller
import pytest
from flask import url_for
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

os.environ["FLASK_ENV"] = "development"
BROWSER = os.environ.get("BROWSER", "ChromeHeadless")


@pytest.fixture(scope="module")
def browser(request):
    if BROWSER == "ChromeHeadless":
        # Ensure the correct version of chromedriver is installed
        chromedriver_autoinstaller.install()
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        # uncomment this if "DevToolsActivePort" error
        chrome_options.add_argument("--remote-debugging-port=9222")
        browser = webdriver.Chrome(options=chrome_options)
    else:
        print("Unsupported BROWSER")
        browser = getattr(webdriver, BROWSER)()
    browser.implicitly_wait(3)
    request.addfinalizer(lambda: browser.quit())
    return browser


@pytest.mark.usefixtures("live_server")
def test_home(browser):
    browser.get(url_for("data", _external=True))
    assert "Insights" in browser.find_element(By.TAG_NAME, "body").text


@pytest.mark.usefixtures("live_server")
def test_javascript_errors_in_page(browser):
    def check_browser():
        for log in browser.get_log("browser"):
            assert "SEVERE" not in log["level"], f"found {log}"

    browser.get(url_for("data", _external=True))
    check_browser()
