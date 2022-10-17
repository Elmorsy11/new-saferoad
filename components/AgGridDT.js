import { useState } from "react";
//Ag grid
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
// import PDFExportPanel from "./pdfExport/PDFExportPanel";
import { Button, Modal } from "react-bootstrap";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
const PDFExportPanel = dynamic(() => import("./pdfExport/PDFExportPanel"), {
  ssr: false,
});
const AgGridDT = ({
  columnDefs,
  rowData,
  onFirstDataRendered,
  rowHeight,
  onSelectionChanged,
  paginationPageSize,
  paginationNumberFormatter,
  defaultColDef,
  onGridReady,
  suppressMenuHide,
  onCellMouseOver,
  onCellMouseOut,
  overlayNoRowsTemplate,
  suppressExcelExport,
  getRowStyle,
  autoSize,
  overlayLoadingTemplate,
  suppressSizeToFit,
  gridApi,
  gridColumnApi,
  Height,
  rowSelection,
}) => {
  const router = useRouter();
  const { darkMode, language } = useSelector((state) => state.config);
  const { t } = useTranslation(["main"]);
  const [openBtnsExportsModel, setOpenBtnsExportsModel] = useState(false);

  const onBtnExport = () => {
    gridApi.exportDataAsCsv();
    setOpenBtnsExportsModel(false);
  };

  const handleOpenBtnsExportsModel = () => setOpenBtnsExportsModel(true);

  return (
    <div
      className={`ag-theme-alpine${darkMode ? "-dark" : ""} ag-grid-style`}
      style={{ height: Height || "" }}
    >
      <AgGridReact
        rowHeight={rowHeight || 65}
        enableRtl={language == "ar" ? true : false}
        columnDefs={columnDefs}
        rowData={rowData}
        rowSelection={rowSelection || 'multiple'}
        onSelectionChanged={onSelectionChanged || null}
        onCellMouseOver={onCellMouseOver || null}
        onCellMouseOut={onCellMouseOut || null}
        pagination={true}
        autoSize={autoSize || false}
        domLayout={"autoHeight"}
        suppressExcelExport={suppressExcelExport || true}
        paginationPageSize={paginationPageSize || 10}
        paginationNumberFormatter={paginationNumberFormatter || null}
        onFirstDataRendered={onFirstDataRendered || null}
        defaultColDef={defaultColDef || null}
        onGridReady={onGridReady || null}
        overlayNoRowsTemplate={overlayNoRowsTemplate}
        suppressMenuHide={suppressMenuHide || true}
        getRowStyle={getRowStyle || null}
        overlayLoadingTemplate={
          overlayLoadingTemplate ||
          `<h3 style="opacity: 0.5">${t("please_wait_while_your_rows_are_loading_key")}</h3>`
        }
        suppressSizeToFit={suppressSizeToFit || false}
      />
      {!router.pathname.includes("/track") && (
        <div className="d-flex">
          <Button variant="primary " className="p-2" onClick={onBtnExport}>
            <FontAwesomeIcon className="me-2" icon={faFileExcel} size="sm" />
            {t("export_to_excel_key")}
          </Button>

          <Button
            variant="primary  ms-2"
            className="p-2"
            onClick={handleOpenBtnsExportsModel}
          >
            <FontAwesomeIcon className="me-2" icon={faFilePdf} size="sm" />
            {t("export_as_pdf_file_key")}
            {/* Export as PDF File */}
          </Button>
        </div>
      )}

      <Modal

        centered
        show={openBtnsExportsModel}
        onHide={() => setOpenBtnsExportsModel(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('PDF_export_options_key')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PDFExportPanel
            gridApi={gridApi}
            columnApi={gridColumnApi}
            setOpenBtnsExportsModel={setOpenBtnsExportsModel}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AgGridDT;
