import "./tab.scss";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { useEffect, useState } from 'react';
import MobileReportDataService from "../../services/mobileCrime.serivices";

const Tab = () => {
  const [mobileReports, setMobileReports] = useState([]);

  useEffect(() => {
    // Fetch mobile crime reports
    fetchMobileCrimeReport();
  }, []);

  // Fetch mobile crime report data
  const fetchMobileCrimeReport = async () => {
    try {
      const data = await MobileReportDataService.getAllMobileReport();
      const mobileReportData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setMobileReports(mobileReportData);
    } catch (error) {
      console.error('Error fetching mobile crime reports:', error);
    }
  };

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tablecell">Report ID</TableCell>
            <TableCell className="tablecell">Reporter</TableCell>
            <TableCell className="tablecell">Date</TableCell>
            <TableCell className="tablecell">Select Department</TableCell>
            <TableCell className="tablecell">Location</TableCell>
            <TableCell className="tablecell">Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {mobileReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="tablecell">{report.caseNo}</TableCell>
              <TableCell className="tablecell">{report.reporter}</TableCell>
           
              <TableCell className="tablecell">{report.date}</TableCell>
              <TableCell className="tablecell">{report.departmentName}</TableCell>

              <TableCell className="tablecell">
                {report.crimeLatitude && report.crimeLongitude && (
                  <a
                    href={`https://www.google.com/maps?q=${report.crimeLatitude},${report.crimeLongitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    crime location
                  </a>
                )}
              </TableCell>


              <TableCell className="tablecell">
                <span className={`Status ${report.Status}`}>{report.Status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Tab;
