using Sullivan.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Runtime.Serialization.Json;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace Sullivan.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult One()
        {
            return View();
        }

        public ActionResult Two()
        {
            return View();
        }

        public ActionResult Three()
        {
            return View();
        }

        public ActionResult Four()
        {
            return View();
        }

        public ActionResult Five()
        {
            return View();
        }

        public ActionResult Six()
        {
            return View();
        }

        public ActionResult EmailData(SessionData session)
        {
            var json = new JavaScriptSerializer().Serialize(session);

            MailMessage mailMessage = new MailMessage();
            mailMessage.To.Add("datasender.2016@gmail.com");
            mailMessage.From = new MailAddress("datasender.2016@gmail.com");
            mailMessage.Subject = "Sullivan data";
            mailMessage.Body = json;

            SmtpClient smtpClient = new SmtpClient();
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Credentials = new System.Net.NetworkCredential("datasender.2016@gmail.com", "DataSender");
            smtpClient.Port = 587;
            smtpClient.Host = "smtp.gmail.com";
            smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtpClient.EnableSsl = true;

            smtpClient.Send(mailMessage);

            return Json("Sent");
        }
    }
}
