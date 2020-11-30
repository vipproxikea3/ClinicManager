using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClinicManager.Models.DataTransferObject
{
    public class ReExaminationDTO
    {
        private static ReExaminationDTO _instant;
        public static ReExaminationDTO Instant
        {
            get
            {
                if (_instant == null)
                    _instant = new ReExaminationDTO();
                return _instant;
            }
            set
            {
                _instant = value;
            }
        }

        #region GET

        public DateTime? GetReExaminationAtByIdHealthRecord(int id)
        {
            ReExamination ReExamination = DataProvider.Instant.DB.ReExaminations.Where(x => x.IdHealthRecord == id).SingleOrDefault();
            if (ReExamination == null) return null;
            return ReExamination.ReExaminationAt;
        }

        #endregion
    }
}