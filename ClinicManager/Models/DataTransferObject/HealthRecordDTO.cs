using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClinicManager.Models.DataTransferObject
{
    public class HealthRecordDTO
    {
        private static HealthRecordDTO _instant;
        public static HealthRecordDTO Instant
        {
            get
            {
                if (_instant == null)
                    _instant = new HealthRecordDTO();
                return _instant;
            }
            set
            {
                _instant = value;
            }
        }

        #region GET
        public List<HealthRecord> GetHealthRecords()
        {
            return DataProvider.Instant.DB.HealthRecords.OrderByDescending(x => x.CreateAt).ToList();
        }

        public HealthRecord GetHealthRecordById(int id)
        {
            return DataProvider.Instant.DB.HealthRecords.Where(x => x.IdHealthRecord == id).SingleOrDefault();
        }

        public List<HealthRecord> GetHealthRecordsByIdPatient(int id)
        {
            return DataProvider.Instant.DB.HealthRecords.Where(x => x.IdPatient == id).ToList();
        }

        public List<HealthRecord> GetHealthRecordsByIdUser(int id)
        {
            return DataProvider.Instant.DB.HealthRecords.Where(x => x.CreateByUser == id || x.UpdateByUser == id).ToList();
        }

        public int CountHealthRecordsByIdPatient(int id)
        {
            return DataProvider.Instant.DB.HealthRecords.Where(x => x.IdPatient == id).ToList().Count;
        }

        public double GetTotalFeeByIdPatient(int id)
        {
            return DataProvider.Instant.DB.HealthRecords.Where(x => x.IdPatient == id).ToList().Sum(x => x.ExaminationFee);
        }

        public List<HealthRecord> GetQueuesHealthRecords()
        {
            DateTime d = DateTime.Now;
            return DataProvider.Instant.DB.HealthRecords.Where(x => x.Status == true && x.missCall == false && x.CreateAt == d).OrderBy(x => x.IndexOfDay).Take(10).ToList();
        }

        public List<HealthRecord> GetMissCallsHealthRecords()
        {
            DateTime d = DateTime.Now;
            return DataProvider.Instant.DB.HealthRecords.Where(x => x.Status == true && x.missCall == true && x.CreateAt == d).OrderBy(x => x.IndexOfDay).Take(10).ToList();
        }

        #endregion
    }
}