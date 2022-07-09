import "./App.css";
import React from 'react'
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useCSVReader } from "react-papaparse";
import { useState } from "react";
import { data } from "./data/data";
function App() {
  const { CSVReader } = useCSVReader();
  const [column, setColumn] = useState();
  const [row, setRow] = useState();

  const convertJsonData = (res) => {
    const givenData = res.data;
    //taking out thr columns array 
    const colArray = givenData.shift();

    //getting array of objects from array of array for datagridPro
    const objectData = res.data.map((row, index) => {
      //each object with key as column
      const outObj = {};
      colArray.forEach((colName, index) => {
        outObj[colName] = row[index];
      });
      return outObj;
    });
    
    //get array of objects for datagridPro column and initializing it with width and headerName
    const coloumnObject = colArray.map((colName) => {
      return {
        field: colName,
        headerName: colName.toUpperCase(),
        minWidth: 100,
        flex: 1,
      };
    });
    
    //updating columns and rows for tab
    setColumn(coloumnObject);
    setRow(objectData);
  };
  
  const removeCSV = () => {
    setRow(null);
    setColumn(null);
  };
  const exportSampleData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";
    
    link.click();
  };
  
  //function for exporting json data
  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(row)
    )}`;

    //creating link , adding href and download and click property
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";
    
    link.click();
  };
  
  //styles for crv converter
  const styles = {
    csvReader: {
      display: "flex",
      flexDirection: "row",
      marginBottom: "5rem",
      marginTop: "5rem",
      margin: "auto",
      maxWidth: "400px",
    },
    browseFile: {
      width: "20%",
    },
    acceptedFile: {
      border: "1px solid #ccc",
      height: 45,
      lineHeight: 2.5,
      paddingLeft: 10,
      width: "80%",
    },
    remove: {
      borderRadius: 5,
      padding: "0 20px",
    },
    progressBarBackgroundColor: {
      backgroundColor: "green",
    },
  };

  return (
    <div className="App" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
      {row && (
        <Button
          variant="contained"
          color="success"
          onClick={exportData}
          style={{ marginBottom: "3rem" }}
        >
          Download Json
        </Button>
      )}
   

      <CSVReader
        onUploadAccepted={(results) => {
          convertJsonData(results);
        }}
      >
        {({
          getRootProps,
          acceptedFile,
          ProgressBar,
          getRemoveFileProps,
        }) => (
          <>
            <div style={styles.csvReader}>
              <button type="button" {...getRootProps()}>
                Browse file
              </button>
              <div style={styles.acceptedFile}>
                {acceptedFile && acceptedFile.name}
              </div>
              {row && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={removeCSV}
                  
                  style={styles.remove}
                >
                  Remove
                </Button>
              )}
            </div>
            <ProgressBar style={styles.progressBarBackgroundColor} />
          </>
        )}
      </CSVReader>

      <div
        style={{
          height: 400,
          width: "100%",
          marginTop: "3rem",
          marginBottom: "3rem",
        }}
      >
        {row && (
          <DataGrid
            rows={row}
            columns={column}
            pageSize={10}
            rowsPerPageOptions={[10]}
            enableSelectionOnClick
          />
        )}
      </div>

      <div>

      </div>
      {!row&& <Button
          variant="contained"
          color="success"
          onClick={exportSampleData}
          style={{ marginBottom: "3rem" }}
        >
          Download sample Json
        </Button>}

    </div>
  );
}

export default App