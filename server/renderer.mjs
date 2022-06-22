import { themeManager } from "./theme-manager.mjs";
import puppeteer from "puppeteer";
import $ from "jquery";
import { JSDOM } from "jsdom";
import Markdown from "markdown-it";

function backendMiddleWare(html) {
  const dom = new JSDOM(html)
  const markdown = Markdown({html: true, xhtmlOut: true, typographer: true, highlight: true})
  Array.from(dom.window.document.body.querySelectorAll("*")).filter(node=> node.children.length === 0)
  .filter(node => !/^[\n\t]/.test(node.textContent)).forEach(node => {
    node.innerHTML = markdown.renderInline(node.textContent)
  })
  return dom.serialize()
}

export async function render(resume_object, theme) {
  let html = (await themeManager.get(theme)).render(resume_object);
  html = backendMiddleWare(html)

  return html
}

export async function renderPage(resume_object, theme, headless = true) {
  const html = await render(resume_object, theme);
  const browser = await puppeteer.launch({ headless });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle2" });
  return [page, browser];
}

export async function renderPDF(resume_object, theme) {
  const [page, browser] = await renderPage(resume_object, theme);
  
  const viewPort = {
    width: 1100,
    height: 960,
  }
  
  await page.setViewport(viewPort);

  const title = await page.title();
  
  await page.emulateMediaType("screen");
  
  const height = await page.evaluate(
    () => document.documentElement.offsetHeight
  );
  const width = await page.evaluate(
    () => document.documentElement.offsetWidth
  );
  await page.addStyleTag({
    content: `@page { size: ${width}px ${height}px; }`,
  });

  const pdf = await page.pdf({
    format: "A4",
    fullPage: true,
    printBackground: true,
    displayHeaderFooter: true,
    preferCSSPageSize: true,
  });
  await browser.close();

  return {pdf, title};
}

// requires display !
export async function test(resume_object, theme) {
  const [page, browser] = await renderPage(resume_object, theme, false);
  const [page_headless, browser_headless] = await renderPage(
    resume_object,
    theme,
    true
  );
  const viewPort = {
    width: 1100,
    height: 960,
  }
  await page_headless.setViewport(viewPort);
  await page.setViewport(viewPort);

  let title = await page_headless.title();

  const b64 = await page_headless.screenshot({
    encoding: "base64",
    type: "png",
    fullPage: true,
  });
  const image_page = await browser.newPage();
  await image_page.setContent(
    `<head><title>IMG : ${title}</title></head><body><img src="data:image/png;base64,${b64}"></body>`
  );

  title = await page_headless.title();
  await page_headless.emulateMediaType("screen");
  let height = await page_headless.evaluate(
    () => document.documentElement.offsetHeight
  );
  let width = await page_headless.evaluate(
    () => document.documentElement.offsetWidth
  );
  await page_headless.addStyleTag({
    content: `@page { size: ${width}px ${height}px; }`,
  });

//   await page_headless.waitForTimeout(1000);

  const pdf = await page_headless.pdf({
    path: "test.pdf",
    format: "A4",
    fullPage: true,
    printBackground: true, //<---
    displayHeaderFooter: true, //<---
    preferCSSPageSize: true,
  });
  const pdfB64 = Buffer.from(pdf).toString("base64");
  const pdf_page = await browser.newPage();
  await pdf_page.setContent(
    `<head><title>PDF : ${title}</title></head><body><embed src="data:application/pdf;base64,${pdfB64}"/></body>`
  );
  await browser_headless.close();

  return {pdf , title};
}
