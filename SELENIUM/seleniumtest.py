from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Assuming Chrome browser
driver = webdriver.Chrome()

# Navegar a la página donde quieres cargar el archivo
driver.get("http://localhost:5173")
# Find the element using xpath

element = driver.find_element(By.XPATH, '/html/body/div/nav/div/div/div/div/div/a[3]')

# Click on the element
element.click()


element = driver.find_element(By.ID, 'fileInputRef')
# element = WebDriverWait(driver, 10).until(
#     EC.element_to_be_clickable((By.ID, 'fileInputRef'))
# )
element.send_keys("C:\\Users\\cajom\\Documents\\SELENIUM\\test.edf")

#time.sleep(5)

element = driver.find_element(By.XPATH, '/html/body/div/nav/div/div/div/div/div/a[4]')

element.click()
tool_select = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, 'toolSelect'))
)
tool_select.click()

option = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.XPATH, '//option[@value="FastWaveletTransform"]'))
)

option.click()

#time.sleep(5)

print("Test passed")

driver.quit()









