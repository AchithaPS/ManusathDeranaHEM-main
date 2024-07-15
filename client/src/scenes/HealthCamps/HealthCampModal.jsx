import React, { useState, useEffect } from "react";
import { Modal, Box, Grid, MenuItem } from "@mui/material";
import Buttons from "components/Buttons";
import CustomTextField from "components/CustomTextField";
import { useAddCampMutation } from "state/api";

const fetchLastHealthCampId = async () => {
  const response = await fetch("/api/camps/last");
  const lastCamp = await response.json();
  return lastCamp ? lastCamp.CampId : null;
};

const generateNextId = (lastId) => {
  const idNumber = parseInt(lastId.split('-')[2], 10);
  const nextIdNumber = (idNumber + 1).toString().padStart(6, '0');
  return `MD-HC-${nextIdNumber}`;
};

const sriLankanData = {
  "Western": {
    "Colombo": ["Colombo 1", "Colombo 2", "Colombo 3", "Colombo 4", "Colombo 5", "Colombo 6", "Colombo 7", "Colombo 8", "Colombo 9", "Colombo 10", "Colombo 11", "Colombo 12", "Colombo 13", "Colombo 14", "Colombo 15"],
    "Gampaha": ["Negombo", "Gampaha", "Veyangoda", "Wattala", "Minuwangoda", "Ja-Ela", "Kadawatha", "Ragama", "Divulapitiya", "Nittambuwa", "Kiribathgoda"],
    "Kalutara": ["Kalutara", "Panadura", "Horana", "Beruwala", "Aluthgama", "Matugama", "Wadduwa", "Bandaragama", "Ingiriya"]
  },
  "Central": {
    "Kandy": ["Kandy", "Gampola", "Nawalapitiya", "Peradeniya", "Akurana", "Kadugannawa", "Katugastota"],
    "Matale": ["Matale", "Dambulla", "Sigiriya", "Nalanda", "Ukuwela", "Rattota"],
    "Nuwara Eliya": ["Nuwara Eliya", "Hatton", "Nanu Oya", "Talawakele", "Bandarawela", "Welimada"]
  },
  "Southern": {
    "Galle": ["Galle", "Hikkaduwa", "Ambalangoda", "Elpitiya", "Bentota", "Baddegama"],
    "Matara": ["Matara", "Weligama", "Mirissa", "Akurugoda", "Hakmana", "Devinuwara"],
    "Hambantota": ["Hambantota", "Tangalle", "Tissamaharama", "Ambalantota", "Beliatta", "Weeraketiya"]
  },
  "Northern": {
    "Jaffna": ["Jaffna", "Nallur", "Chavakachcheri", "Point Pedro", "Karainagar", "Velanai"],
    "Kilinochchi": ["Kilinochchi", "Pallai", "Paranthan", "Poonakary"],
    "Mannar": ["Mannar", "Nanattan", "Madhu", "Pesalai"],
    "Vavuniya": ["Vavuniya", "Nedunkeni", "Settikulam", "Vavuniya South"],
    "Mullaitivu": ["Mullaitivu", "Oddusuddan", "Puthukudiyiruppu", "Weli Oya"]
  },
  "Eastern": {
    "Trincomalee": ["Trincomalee", "Kinniya", "Mutur", "Kuchchaveli"],
    "Batticaloa": ["Batticaloa", "Kaluwanchikudy", "Valachchenai", "Eravur"],
    "Ampara": ["Ampara", "Akkaraipattu", "Kalmunai", "Sainthamaruthu", "Pottuvil"]
  },
  "North Western": {
    "Kurunegala": ["Kurunegala", "Kuliyapitiya", "Narammala", "Wariyapola", "Pannala", "Melsiripura"],
    "Puttalam": ["Puttalam", "Chilaw", "Wennappuwa", "Anamaduwa", "Nattandiya", "Dankotuwa"]
  },
  "North Central": {
    "Anuradhapura": ["Anuradhapura", "Kekirawa", "Thambuttegama", "Eppawala", "Medawachchiya"],
    "Polonnaruwa": ["Polonnaruwa", "Kaduruwela", "Medirigiriya", "Hingurakgoda"]
  },
  "Uva": {
    "Badulla": ["Badulla", "Bandarawela", "Haputale", "Welimada", "Mahiyanganaya", "Passara"],
    "Monaragala": ["Monaragala", "Bibile", "Wellawaya", "Medagama", "Buttala"]
  },
  "Sabaragamuwa": {
    "Ratnapura": ["Ratnapura", "Embilipitiya", "Balangoda", "Pelmadulla", "Eheliyagoda", "Kuruwita"],
    "Kegalle": ["Kegalle", "Mawanella", "Warakapola", "Rambukkana", "Galigamuwa"]
  }
};

const HealthCampModal = ({ openModal, handleCloseModal }) => {
  const [campId, setCampId] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [town, setTown] = useState("");
  const [mohFields, setMohFields] = useState([""]);
  const [contactPersons, setContactPersons] = useState([{ cname: "", cnumber: "" }]);
  const [sponsors, setSponsors] = useState([""]);
  const [errors, setErrors] = useState({});
  const [addCamp] = useAddCampMutation();

  const [districts, setDistricts] = useState([]);
  const [towns, setTowns] = useState([]);

  useEffect(() => {
    const initializeCampId = async () => {
      const lastId = await fetchLastHealthCampId();
      setCampId(lastId ? generateNextId(lastId) : "MD-HC-000001");
    };
    initializeCampId();
  }, []);

  useEffect(() => {
    if (province) {
      setDistricts(Object.keys(sriLankanData[province]));
    } else {
      setDistricts([]);
    }
    setDistrict("");
    setTown("");
  }, [province]);

  useEffect(() => {
    if (district) {
      setTowns(sriLankanData[province][district]);
    } else {
      setTowns([]);
    }
    setTown("");
  }, [district]);

  const handleClickAddMoh = () => {
    setMohFields([...mohFields, ""]);
  };

  const handleClickAddPerson = () => {
    setContactPersons([...contactPersons, { cname: "", cnumber: "" }]);
  };

  const handleClickAddSponsor = () => {
    setSponsors([...sponsors, ""]);
  };

  const handleChangeContactPerson = (index, field, value) => {
    const updatedContactPersons = [...contactPersons];
    updatedContactPersons[index][field] = value;
    setContactPersons(updatedContactPersons);
  };

  const handleChangeMohField = (index, value) => {
    const updatedMohFields = [...mohFields];
    updatedMohFields[index] = value;
    setMohFields(updatedMohFields);
  };

  const handleChangeSponsorField = (index, value) => {
    const updatedSponsors = [...sponsors];
    updatedSponsors[index] = value;
    setSponsors(updatedSponsors);
  };

  const validatePhoneNumber = (number) => /^\d+$/.test(number);

  const handleClick = () => {
    const newErrors = {};
    if (!campId) newErrors.campId = "Camp ID is required";
    if (!province) newErrors.province = "Province is required";
    if (!district) newErrors.district = "District is required";
    if (!town) newErrors.town = "Town is required";
    contactPersons.forEach((person, index) => {
      if (!person.cname) newErrors[`contactPersons${index}cname`] = "Name is required";
      if (!person.cnumber) newErrors[`contactPersons${index}cnumber`] = "Phone number is required";
      else if (!validatePhoneNumber(person.cnumber)) newErrors[`contactPersons${index}cnumber`] = "Phone number must contain only numbers";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      addCamp({ CampId: campId, Province: province, District: district, Town: town, MOH: mohFields, ContactPersons: contactPersons, Sponsors: sponsors })
        .then((response) => {
          console.log("Camp added successfully:", response);
          setCampId(generateNextId(campId)); // Set the next CampId for the next entry
          setProvince("");
          setDistrict("");
          setTown("");
          setMohFields([""]);
          setContactPersons([{ cname: "", cnumber: "" }]);
          setSponsors([""]);
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Error adding camp:", error);
        });
    }
  };

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 600,
          bgcolor: "#fff",
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
        }}
      >
        <h2 id="modal-modal-title">Create Health Camp</h2>

        <Box sx={{ mt: 6 }}>
          <CustomTextField
            label="Camp ID"
            variant="outlined"
            value={campId}
            onChange={(e) => setCampId(e.target.value)}
            fullWidth
            error={!!errors.campId}
            helperText={errors.campId}
            disabled
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <label style={{ fontWeight: "bold", color: "black", fontSize: "16px", marginTop: "16px" }} htmlFor="Add Location name">
            Add Location Name
          </label>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={4}>
              <CustomTextField
                label="Province"
                variant="outlined"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                select
                fullWidth
                error={!!errors.province}
                helperText={errors.province}
              >
                {Object.keys(sriLankanData).map((prov) => (
                  <MenuItem key={prov} value={prov}>
                    {prov}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={4}>
              <CustomTextField
                label="District"
                variant="outlined"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                select
                fullWidth
                error={!!errors.district}
                helperText={errors.district}
                disabled={!province}
              >
                {districts.map((dist) => (
                  <MenuItem key={dist} value={dist}>
                    {dist}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={4}>
              <CustomTextField
                label="Town"
                variant="outlined"
                value={town}
                onChange={(e) => setTown(e.target.value)}
                select
                fullWidth
                error={!!errors.town}
                helperText={errors.town}
                disabled={!district}
              >
                {towns.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {mohFields.map((moh, index) => (
              <Grid item xs={4} key={index}>
                <CustomTextField
                  label={`MOH ${index + 1}`}
                  variant="outlined"
                  value={moh}
                  onChange={(e) => handleChangeMohField(index, e.target.value)}
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Buttons onClick={handleClickAddMoh} label="Add another MOH" />
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <label style={{ fontWeight: "bold", color: "black", fontSize: "16px", marginTop: "16px" }} htmlFor="Add Location name">
            Camp Contact Persons
          </label>
        </Box>
        {contactPersons.map((person, index) => (
          <Box key={index} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <CustomTextField
                  label="Name"
                  variant="outlined"
                  value={person.cname}
                  onChange={(e) => handleChangeContactPerson(index, "cname", e.target.value)}
                  fullWidth
                  error={!!errors[`contactPersons${index}cname`]}
                  helperText={errors[`contactPersons${index}cname`]}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomTextField
                  label="Mobile Number"
                  variant="outlined"
                  value={person.cnumber}
                  onChange={(e) => handleChangeContactPerson(index, "cnumber", e.target.value)}
                  fullWidth
                  error={!!errors[`contactPersons${index}cnumber`]}
                  helperText={errors[`contactPersons${index}cnumber`]}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
        <Box sx={{ mt: 2 }}>
          <Buttons onClick={handleClickAddPerson} label="Add another Person" />
        </Box>

        <Box sx={{ mt: 3 }}>
          <label style={{ fontWeight: "bold", color: "black", fontSize: "16px", marginTop: "16px" }} htmlFor="Add Location name">
            Add Camp Activities
          </label>
        </Box>
        <Box sx={{ mt: 3 }}>
          <CustomTextField
            label="Add Camp Activities"
            variant="outlined"
            fullWidth
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <label style={{ fontWeight: "bold", color: "black", fontSize: "16px", marginTop: "16px" }} htmlFor="Add Location name">
            Add Sponsors
          </label>
        </Box>
        {sponsors.map((sponsor, index) => (
          <Box key={index} sx={{ mt: 2 }}>
            <CustomTextField
              label={`Sponsor ${index + 1}`}
              variant="outlined"
              value={sponsor}
              onChange={(e) => handleChangeSponsorField(index, e.target.value)}
              fullWidth
            />
          </Box>
        ))}
        <Box sx={{ mt: 2 }}>
          <Buttons onClick={handleClickAddSponsor} label="Add Another Sponsor" />
        </Box>

        <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
          <Buttons onClick={handleClick} label="Create Health Camp" />
        </Box>
      </Box>
    </Modal>
  );
};

export default HealthCampModal;
