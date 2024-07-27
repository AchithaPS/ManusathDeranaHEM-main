import { Dialog, Box, DialogContent, DialogTitle, DialogActions, IconButton, CircularProgress, Button, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from "@mui/material/styles";
import { useAddDonorVolunteerMutation, useGetDeranaDaruwoProgramsQuery, useGetStudentsQuery  } from 'state/api';
import CustomTextField from 'components/CustomTextField';


const DonorRegistrationModal = ({ openModal, closeModal }) => {

    const theme = useTheme();
    const[donorID,setDonorID]=useState("");
    const[donorName,setDonorName]=useState("");
    const[donorAddress,setDonorAddress]=useState("");
    const[contactNumber,setContactNumber]=useState("");
    const[studentID,setStudentID]=useState("");
    const[programID,setProgramID]=useState("");
    const [addDonor] =   useAddDonorVolunteerMutation();
    const { data: students, refetch, error } = useGetStudentsQuery();
    const { data: programs, isLoading, isError } = useGetDeranaDaruwoProgramsQuery();
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleAddDonor = () => {
    const donorData = {
      donorID,
      donorName,
      donorAddress,
      contactNumber,
      studentID,
      programID,
    };

    addDonor(donorData)
      .then((response) => {
        console.log("School added successfully:", response);
        // Clear form fields
        setDonorID("");
        setDonorName("");
        setDonorAddress("");
        setContactNumber("");
        setStudentID("");
        setProgramID("");
        closeModal();
       
      })
      .catch((error) => {
        console.error("Error adding school:", error);
      });
  };
  const labelStyle = {
    fontWeight: "bold",
    color: "black",
    fontSize: "16px",
    marginTop: "16px",
  };

  return (
    <>
    <Dialog
    fullScreen
    open={openModal}
    onClose={closeModal}
    aria-labelledby="form-dialog-title"
    >
     <DialogTitle sx={{ bgcolor: "#f0f0f0", position: 'relative' }} id="form-dialog-title">
          <div style={{ color: "#d63333", fontWeight: '700', fontSize: '16px' }}>
            {"Dornor Registration"}
            <hr style={{ borderColor: "#d63333", }} />
          </div>
          <IconButton
            aria-label="close"
            onClick={closeModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            }}
          >
            {/* Add your icon component here */}
          </IconButton>
        </DialogTitle>
        <DialogContent>
        <Box sx={{ mt: 6 }}>
                        <CustomTextField
                            label="Donor ID"
                            variant="outlined"
                            fullWidth
                            value={donorID}
                            onChange={(e) => setDonorID(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ mt: 6 }}>
                        <CustomTextField
                            label="Donor Name"
                            variant="outlined"
                            fullWidth
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ mt: 6 }}>
                        <CustomTextField
                            label="Donor Address"
                            variant="outlined"
                            fullWidth
                            value={donorAddress}
                            onChange={(e) => setDonorAddress(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ mt: 6 }}>
                        <CustomTextField
                            label="Contact Number"
                            variant="outlined"
                            fullWidth
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                        />
                    </Box>

                    <h3>Assign Student ID</h3>
                    <Box sx={{ mt: 6 }}>
                    <FormControl fullWidth variant="outlined">
              <InputLabel>Select Student ID</InputLabel>
              <Select
                value={studentID}
                onChange={(e) => setStudentID(e.target.value)}
                label="Select Student ID"
                disabled={isLoading || isError}
              >
                {isLoading && <MenuItem disabled>Loading...</MenuItem>}
                {isError && <MenuItem disabled>Error loading programs</MenuItem>}
                {students && students.map((student) => (
                  <MenuItem key={student.studentID} value={student.studentID}>
                     {student.studentID}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
                    </Box>

                    <h3>program ID</h3>
                    <Box sx={{ mt: 6 }}>
                    <FormControl fullWidth variant="outlined">
              <InputLabel>Select Program ID</InputLabel>
              <Select
                value={programID}
                onChange={(e) => setProgramID(e.target.value)}
                label="Select Program ID"
                disabled={isLoading || isError}
              >
                {isLoading && <MenuItem disabled>Loading...</MenuItem>}
                {isError && <MenuItem disabled>Error loading programs</MenuItem>}
                {programs && programs.map((program) => (
                  <MenuItem key={program.programId} value={program.programId}>
                     {program.programId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
                    </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#f0f0f0" }}>
          <Button
            onClick={handleAddDonor}
            color="secondary"
            variant="contained"
            disabled={loading}
            endIcon={loading && <CircularProgress size={20} />}
          >
            {"Register Donor"}
          </Button>
          <Button onClick={closeModal} variant="outlined" color="secondary">
            Cancel
          </Button>
        </DialogActions>
    </Dialog>

    <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default DonorRegistrationModal
