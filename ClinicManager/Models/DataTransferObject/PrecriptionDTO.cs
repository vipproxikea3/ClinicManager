using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClinicManager.Models.DataTransferObject
{
    public class PrecriptionDTO
    {
        private static PrecriptionDTO _instant;
        public static PrecriptionDTO Instant
        {
            get
            {
                if (_instant == null)
                    _instant = new PrecriptionDTO();
                return _instant;
            }
            set
            {
                _instant = value;
            }
        }

        #region GET

        public List<Precription> GetPrecriptionByIdHealthRecord(int id)
        {
            return DataProvider.Instant.DB.Precriptions.Where(x => x.IdHealthRecord == id).ToList();
        }

        #endregion
    }
}