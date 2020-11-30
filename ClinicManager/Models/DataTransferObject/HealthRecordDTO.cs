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

        #endregion
    }
}