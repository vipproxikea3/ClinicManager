using ClinicManager.Models;
using ClinicManager.Models.DataTransferObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;

namespace ClinicManager.Controllers
{
    public class managerController : Controller
    {
        // GET: manager
        public ActionResult profile()
        {
            return View();
        }

        // METHOD
        public JsonResult setPass(Account acc)
        {
            if (HttpContext.Request.HttpMethod == HttpMethod.Get.Method)
            {
                Response.Redirect("/page_not_found");
                return Json("Deny Get Request", JsonRequestBehavior.AllowGet);
            }
            else
                return Json(AccountDTO.Instant.SetPass(acc), JsonRequestBehavior.AllowGet);
        }
        public JsonResult getAccountById(int id)
        {
            return Json(AccountDTO.Instant.GetAccountById(id), JsonRequestBehavior.AllowGet);
        }
    }
}