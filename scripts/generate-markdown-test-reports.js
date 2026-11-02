import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

console.log('Generating GitHub Markdown Test Case Display files...');

// 1. Process Selenium Test Cases
const seleniumXlsxPath = path.resolve('selenium-tests/selenium-test-cases.xlsx');
if (fs.existsSync(seleniumXlsxPath)) {
  const workbook = XLSX.readFile(seleniumXlsxPath);
  const detailsSheet = workbook.Sheets['Test Details'];
  const summarySheet = workbook.Sheets['Test Summary'];
  
  const testCases = XLSX.utils.sheet_to_json(detailsSheet);
  const summary = XLSX.utils.sheet_to_json(summarySheet);
  
  let md = '# 🌐 Selenium Web E2E Test Suite (300 Test Cases)\n\n';
  md += 'Automated end-to-end functionality testing suite for the SafeTravel Web Frontend built with **Selenium WebDriver**.\n\n';
  md += '### 📊 Test Suite Summary\n\n';
  md += '| Category / Metric | Total Cases | Automated | Manual | Status |\n';
  md += '| :--- | :--- | :--- | :--- | :--- |\n';
  
  summary.forEach(row => {
    md += `| **${row['Category / Module'] || ''}** | ${row['Total Cases'] || ''} | ${row['Automated'] || ''} | ${row['Manual / Exploratory'] || ''} | ${row['Status'] || ''} |\n`;
  });
  
  md += '\n---\n\n### 📋 Detailed Test Cases (300 Cases)\n\n';
  md += '| Test ID | Module | Title | Test Objective / Precondition | Test Steps | Expected Result | Priority | Type | Status |\n';
  md += '| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n';
  
  testCases.forEach(tc => {
    const steps = (tc['Test Steps'] || '').replace(/\n/g, '<br>');
    md += `| **${tc['Test ID']}** | ${tc['Module']} | ${tc['Test Case Title']} | ${tc['Pre-conditions / Objective']} | ${steps} | ${tc['Expected Result']} | ${tc['Priority']} | ${tc['Execution Type']} | ${tc['Status']} |\n`;
  });
  
  fs.writeFileSync('selenium-tests/README.md', md, 'utf-8');
  console.log('✅ Generated selenium-tests/README.md with', testCases.length, 'test cases');
}

// 2. Process Appium Test Cases
const appiumXlsxPath = path.resolve('appium-tests/appium-test-cases.xlsx');
if (fs.existsSync(appiumXlsxPath)) {
  const workbook = XLSX.readFile(appiumXlsxPath);
  const detailsSheet = workbook.Sheets['Test Details'];
  const summarySheet = workbook.Sheets['Test Summary'];
  
  const testCases = XLSX.utils.sheet_to_json(detailsSheet);
  const summary = XLSX.utils.sheet_to_json(summarySheet);
  
  let md = '# 📱 Appium Mobile E2E Test Suite (300 Test Cases)\n\n';
  md += 'Mobile end-to-end functionality testing suite for the SafeTravel Android / iOS App built with **Appium & WebDriverIO**.\n\n';
  md += '### 📊 Mobile Test Suite Summary\n\n';
  md += '| Category / Module | Total Cases | Automated | Manual | Status |\n';
  md += '| :--- | :--- | :--- | :--- | :--- |\n';
  
  summary.forEach(row => {
    md += `| **${row['Category / Module'] || ''}** | ${row['Total Cases'] || ''} | ${row['Automated'] || ''} | ${row['Manual / Exploratory'] || ''} | ${row['Status'] || ''} |\n`;
  });
  
  md += '\n---\n\n### 📋 Detailed Mobile Test Cases (300 Cases)\n\n';
  md += '| Test ID | Module | Title | Test Objective / Precondition | Test Steps | Expected Result | Priority | Type | Status |\n';
  md += '| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n';
  
  testCases.forEach(tc => {
    const steps = (tc['Test Steps'] || '').replace(/\n/g, '<br>');
    md += `| **${tc['Test ID']}** | ${tc['Module']} | ${tc['Test Case Title']} | ${tc['Pre-conditions / Objective']} | ${steps} | ${tc['Expected Result']} | ${tc['Priority']} | ${tc['Execution Type']} | ${tc['Status']} |\n`;
  });
  
  fs.writeFileSync('appium-tests/README.md', md, 'utf-8');
  console.log('✅ Generated appium-tests/README.md with', testCases.length, 'test cases');
}

// 3. Process Load Test Report
const loadXlsxPath = path.resolve('load-tests/load-test-report.xlsx');
if (fs.existsSync(loadXlsxPath)) {
  const workbook = XLSX.readFile(loadXlsxPath);
  const summarySheet = workbook.Sheets['Executive Load Summary'];
  const timelineSheet = workbook.Sheets['Timeline'];
  
  const summary = XLSX.utils.sheet_to_json(summarySheet);
  const timeline = XLSX.utils.sheet_to_json(timelineSheet);
  
  let md = '# ⚡ SafeTravel Baseline Concurrency Load Test Report\n\n';
  md += 'Continuous baseline performance benchmark simulating **100 concurrent Virtual Users (VUs)** for **60 seconds** against the SafeTravel backend.\n\n';
  md += '### 📊 Performance Summary\n\n';
  md += '| Metric | Benchmark Value |\n';
  md += '| :--- | :--- |\n';
  summary.forEach(row => {
    md += `| **${row['Metric'] || ''}** | ${row['Value'] || ''} |\n`;
  });
  
  md += '\n### ⏱️ Timeline Metrics (First 20 Seconds Sample)\n\n';
  md += '| Elapsed Second | Requests Sent | Current RPS | Cumulative Success | Cumulative Errors |\n';
  md += '| :--- | :--- | :--- | :--- | :--- |\n';
  timeline.slice(0, 20).forEach(row => {
    md += `| ${row['Elapsed (s)']}s | ${row['Requests in Window']} | ${row['Current RPS']} req/s | ${row['Cumulative Success']} | ${row['Cumulative Errors']} |\n`;
  });
  
  fs.writeFileSync('load-tests/README.md', md, 'utf-8');
  console.log('✅ Generated load-tests/README.md');
}

console.log('Markdown generation complete!');
