//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ClinicManager.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class HealthRecord
    {
        public int IdHealthRecord { get; set; }
        public Nullable<System.DateTime> CreateAt { get; set; }
        public int CreateByUser { get; set; }
        public double ExaminationFee { get; set; }
        public Nullable<bool> IsReExamination { get; set; }
        public Nullable<int> UpdateByUser { get; set; }
        public int IdPatient { get; set; }
        public string Symptom { get; set; }
        public string Diagnosis { get; set; }
        public Nullable<int> IndexOfDay { get; set; }
        public Nullable<bool> missCall { get; set; }
        public Nullable<bool> Status { get; set; }
    }
}
