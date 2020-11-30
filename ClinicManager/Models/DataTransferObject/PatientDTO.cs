using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClinicManager.Models.DataTransferObject
{
    public class PatientDTO
    {
        private static PatientDTO _instant;
        public static PatientDTO Instant
        {
            get
            {
                if (_instant == null)
                    _instant = new PatientDTO();
                return _instant;
            }
            set
            {
                _instant = value;
            }
        }

        #region POST
        public void CreatePatient(Patient patientObj)
        {
            DataProvider.Instant.DB.Patients.Add(new Patient() { Name = patientObj.Name, DateOfBirth = patientObj.DateOfBirth, Gender = patientObj.Gender, IdentityCardNumber = patientObj.IdentityCardNumber });
            DataProvider.Instant.DB.SaveChanges();
        }
        #endregion

        #region GET
        public List<Patient> GetPatients()
        {
            return DataProvider.Instant.DB.Patients.OrderByDescending(x => x.CreateAt).ToList();
        }

        public Patient GetPatientById(int id)
        {
            return DataProvider.Instant.DB.Patients.Where(x => x.IdPatient == id).FirstOrDefault();
        }

        public string GetPatientNameById(int id)
        {
            return DataProvider.Instant.DB.Patients.Where(x => x.IdPatient == id).First().Name;
        }

        public Patient GetPatientByIdentityCardNumber(string number)
        {
            return DataProvider.Instant.DB.Patients.Where(x => x.IdentityCardNumber == number).FirstOrDefault();
        }
        #endregion

        #region PUT
        public void UpdatePatient(Patient patientObj)
        {
            Patient patient = DataProvider.Instant.DB.Patients.Where(x => x.IdPatient == patientObj.IdPatient).FirstOrDefault();
            patient.Name = patientObj.Name;
            patient.DateOfBirth = patientObj.DateOfBirth;
            patient.Gender = patientObj.Gender;
            DataProvider.Instant.DB.SaveChanges();
        }
        #endregion
    }
}