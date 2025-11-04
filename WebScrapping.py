import sys
import json
import time
import random
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
from faker import Faker
import pandas as pd

# Setup Faker
fake = Faker()

# Setup Selenium WebDriver
chrome_driver_path = r"C:\Users\benma\Downloads\chromedriver-win64\chromedriver-win64\chromedriver.exe"
service = Service(chrome_driver_path)
options = webdriver.ChromeOptions()
options.add_argument("--headless")
driver = webdriver.Chrome(service=service, options=options)

# Accept URL from command line argument
url = sys.argv[1]

# Visit the URL
driver.get(url)
time.sleep(3)

# Parse page
soup = BeautifulSoup(driver.page_source, "lxml")

# Extract company name
company_name_raw = soup.find("title").text.strip() if soup.find("title") else fake.company()
company_name_clean = re.sub(r'\W+', '', company_name_raw.split()[0].lower())

# About Us
about = soup.find("meta", {"name": "description"})
about_text = about["content"].strip() if about and about.get("content") else fake.text(100)

# Email and phone
email = f"contact@{company_name_clean}.tn"
phone = f"+216 {random.randint(10000000, 99999999)}"

# Real Tunisian cities
tunisian_cities = [
    "Tunis", "Sfax", "Sousse", "Ettadhamen", "Kairouan",
    "Gabès", "Bizerte", "Ariana", "Gafsa", "El Mourouj",
    "Ben Arous", "Kasserine", "Monastir", "Médenine", "Zarzis",
    "Nabeul", "Mahdia", "Beja", "Jendouba", "Siliana"
]
location = f"{random.choice(tunisian_cities)}, Tunisia"

# Build data
data = {
    "Company Name": company_name_raw,
    "Phone": phone,
    "Email": email,
    "About Us": about_text,
    "Location": location
}

# Output the result as JSON
print(json.dumps(data))

# Cleanup
driver.quit()
