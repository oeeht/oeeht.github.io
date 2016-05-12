/* Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

if (!PDFJS.PDFViewer || !PDFJS.getDocument) {
  alert('Please build the pdfjs-dist library using\n' +
        '  `gulp dist`');
}

// The workerSrc property shall be specified.
//
PDFJS.workerSrc = 'build/pdf.worker.js';

// Some PDFs need external cmaps.
//
// PDFJS.cMapUrl = '../../build/dist/cmaps/';
// PDFJS.cMapPacked = true;

var pdfDoc = null;
var DEFAULT_URL = '../test.pdf';
var PAGE_TO_VIEW = 1;
var SCALE = document.getElementById("scale").value;

var container = document.getElementById('pageContainer');

var PAGE_SEL = document.getElementById('page_num');

/**
  * Load the pdf to render
  */
function loadPDF(pdfData) {
  var pdf = PDFJS.getDocument(DEFAULT_URL);
  SCALE = document.getElementById('scale').value;
  pdf.then(renderPDF);
}

/**
  * Get the page to render
  */
function renderPDF(pdf) {
  document.getElementById('page_num').value = PAGE_TO_VIEW;
  var page = pdf.getPage(PAGE_TO_VIEW);
  page.then(renderPage);
}

/**
  * Render the page
  */
function renderPage(pdfPage) {
    // Creating the page view with default parameters.
    var pdfPageView = new PDFJS.PDFPageView({
      container: container,
      id: PAGE_TO_VIEW,
      scale: SCALE,
      defaultViewport: pdfPage.getViewport(SCALE),
      // We can enable text/annotations layers, if needed
      textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
      annotationLayerFactory: new PDFJS.DefaultAnnotationLayerFactory()
    });
    document.getElementById('page_num').textContent = PAGE_TO_VIEW;
    // Associates the actual page with the view, and drawing it
    pdfPageView.setPdfPage(pdfPage);
    return pdfPageView.draw();
}

/**
  * Delete old div to display the new page
  */
function ReplaceDiv(oldPage) {
  var parent = document.getElementById("pageContainer"); 
  var child = document.getElementById("pageContainer" + oldPage); 
  var del = parent.removeChild(child);
}

/**
  * Displays previous page.
  */
function PrevPage() {
  if (PAGE_TO_VIEW <= 1) {
    return;
  }
  ReplaceDiv(PAGE_TO_VIEW);
  PAGE_TO_VIEW--;
  loadPDF(DEFAULT_URL);
}document.getElementById('prev').addEventListener('click', PrevPage);
  
/**
  * Displays next page.
  */
function NextPage() {
  if (PAGE_TO_VIEW >= pdfDoc.numPages) {
    return;
  }
  ReplaceDiv(PAGE_TO_VIEW);
  PAGE_TO_VIEW++;
  loadPDF(DEFAULT_URL);
}document.getElementById('next').addEventListener('click', NextPage);

/**
  * Go to first page.
  */
function FirstPage() {
  if (PAGE_TO_VIEW <= 1) {
    return;
  }
  ReplaceDiv(PAGE_TO_VIEW);
  PAGE_TO_VIEW=1;
  loadPDF(DEFAULT_URL);
}document.getElementById('first').addEventListener('click', FirstPage);

/**
  * Go to last page.
  */
function LastPage() {
  if (PAGE_TO_VIEW >= pdfDoc.numPages) {
    return;
  }
  ReplaceDiv(PAGE_TO_VIEW);
  PAGE_TO_VIEW=pdfDoc.numPages;
  loadPDF(DEFAULT_URL);
}document.getElementById('last').addEventListener('click', LastPage);

/**
  * Zoom in (+)
  */
function ZoomIn() {
  document.getElementById("scale").selectedIndex++;
  ReplaceDiv(PAGE_TO_VIEW);
  loadPDF(DEFAULT_URL);
}document.getElementById('zoomIn').addEventListener('click', ZoomIn);

/**
  * Zoom out (-)
  */
function ZoomOut() {
  document.getElementById("scale").selectedIndex--;
  ReplaceDiv(PAGE_TO_VIEW);
  loadPDF(DEFAULT_URL);
}document.getElementById('zoomOut').addEventListener('click', ZoomOut);

/**
  * Change zoom (from selectbox)
  */
function ChangeZoom() {
  SCALE = document.getElementById('scale').value;
  ReplaceDiv(PAGE_TO_VIEW);
  loadPDF(DEFAULT_URL);
}document.getElementById('scale').addEventListener('change', ChangeZoom);

/**
  * Asynchronously downloads PDF.
  */
PDFJS.getDocument(DEFAULT_URL).then(function (pdfDoc_) {
  pdfDoc = pdfDoc_;
  document.getElementById('page_count').textContent = pdfDoc.numPages;
  SCALE = document.getElementById('scale').value;
  // Initial/first page rendering
  loadPDF(pdfDoc);
});
