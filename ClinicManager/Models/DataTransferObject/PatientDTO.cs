using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClinicManager.Models.DataTransferObject
{
    public class PatientDTO
    {
        #region POST
        public void CreatePatient(string Name, string DayOfBirth, bool Gender, string IdentityCardNumber)
        {
            string[] eOfD = DayOfBirth.Split('-');
            DateTime dOfB = new DateTime(Int32.Parse(eOfD[0]), Int32.Parse(eOfD[1]), Int32.Parse(eOfD[2]));

            DataProvider.Instant.DB.Patients.Add(new Patient() { Name = Name, DateOfBirth = dOfB, Gender = Gender, IdentityCardNumber = IdentityCardNumber });
            DataProvider.Instant.DB.SaveChanges();
        }
        #endregion

        #region GET
        public List<Patient> GetPatients()
        {
            return DataProvider.Instant.DB.Patients.ToList();
        }

        public Patient GetPatientById(int id)
        {
            return DataProvider.Instant.DB.Patients.Where(x => x.IdPatient == id).FirstOrDefault();
        }

        public Patient GetPatientByIdentityCardNumber(string number)
        {
            return DataProvider.Instant.DB.Patients.Where(x => x.IdentityCardNumber == number).FirstOrDefault();
        }
        #endregion

        #region PUT
        public void UpdatePatient(int IdPatient, string Name, string DayOfBirth, bool Gender)
        {
            Patient patient = DataProvider.Instant.DB.Patients.Where(x => x.IdPatient == IdPatient).FirstOrDefault();
            patient.Name = Name;

            string[] eOfD = DayOfBirth.Split('-');
            DateTime dOfB = new DateTime(Int32.Parse(eOfD[0]), Int32.Parse(eOfD[1]), Int32.Parse(eOfD[2]));
            patient.DateOfBirth = dOfB;

            patient.Gender = Gender;
            DataProvider.Instant.DB.SaveChanges();
        }
        #endregion
    }
}