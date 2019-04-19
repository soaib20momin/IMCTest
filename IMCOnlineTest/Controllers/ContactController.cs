using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IMCOnlineTest.Controllers
{
    public class ContactController : Controller
    {
        // GET: Contact
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SaveContactData()
        {
            bool status = false;
            string message = "";
            if (ModelState.IsValid)
            {
                //####################################################
                //The API endpoint to save the Data is showing Error
                //####################################################
                //using (MyDatabaseEntities dc = new MyDatabaseEntities())
                //{
                    //dc.ContactsDatas.Add(contact);
                    //dc.SaveChanges();
                    status = true;
                    message = "Thank you for submit your query";
                //}
            }
            else
            {
                message = "Failed! Please try again";
            }
            return new JsonResult { Data = new { status = status, message = message } };
        }
    }
}