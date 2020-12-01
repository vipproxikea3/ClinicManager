using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClinicManager.Models.DataTransferObject
{
    public class AccountDTO
    {
        private static AccountDTO _instant;
        public static AccountDTO Instant
        {
            get
            {
                if (_instant == null)
                    _instant = new AccountDTO();
                return _instant;
            }
            set
            {
                _instant = value;
            }
        }

        #region GET

        public string GetAccountNameById(int? id)
        {
            if (id == null) return null;
            Account acc = DataProvider.Instant.DB.Accounts.Where(x => x.IdUser == id).SingleOrDefault();
            return acc.Name;
        }

        public Account GetAccountById(int id)
        {
            return DataProvider.Instant.DB.Accounts.Where(x => x.IdUser == id).SingleOrDefault();
        }

        public Account Login(string username, string password)
        {
            return DataProvider.Instant.DB.Accounts.Where(x => x.Username == username && x.Password == password).SingleOrDefault();
        }

        public string SetPass(Account data)
        {
            Account acc = DataProvider.Instant.DB.Accounts.Where(x => x.Username == data.Username).SingleOrDefault();
            acc.Password = data.Password;
            DataProvider.Instant.DB.SaveChanges();
            return "success";
        }

        #endregion
    }
}