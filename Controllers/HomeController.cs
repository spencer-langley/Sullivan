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
            mailMessage.IsBodyHtml = true;
            mailMessage.To.Add("datasender.2016@gmail.com");
            mailMessage.From = new MailAddress("datasender.2016@gmail.com");
            mailMessage.Body = CreateEmailBodyFromSessionData(session);
            mailMessage.Subject = "Sullivan data";

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

        private string CreateEmailBodyFromSessionData(SessionData session)
        {
            long start = session.startTime;
            long end = session.endTime;
            long duration = end - start;
            double kRate = (session.k_StrokeTimes.Count * 60000) / ((double)duration);
            double dRate = (session.d_StrokeTimes.Count * 60000) / ((double)duration);

            string markup = "<HTML><BODY>";

            markup += ("Phase: " + session.SessionType + "<br />");
            markup += ("Session start: " + session.startDateTime + "<br />");
            markup += ("Session end: " + session.endDateTime + "<br /><br />");

            markup += ("Total k-rate / min: " + kRate.ToString() + "<br />");
            markup += ("Total d-rate / min: " + dRate.ToString() + "<br /><br />");

            if (session.SubSessions != null)
            {
                for (int i = 0; i < session.SubSessions.Count; i++)
                {
                    markup += GetSubSessionMarkup(session.SubSessions[i], i);
                }
            }

            int length = session.k_StrokeTimes.Count;
            if (session.d_StrokeTimes.Count > length)
            {
                length = session.d_StrokeTimes.Count;
            }

            markup += "Key Stroke Times (ms after session start):";
            markup += "<table><tr><td>K</td><td>D</td>";

            for (int i = 0; i < length; i++)
            {
                string kVal = string.Empty;
                string dVal = string.Empty;
                if (session.k_StrokeTimes.Count > i)
                {
                    kVal = (session.k_StrokeTimes[i] - session.startTime).ToString();
                }
                if (session.d_StrokeTimes.Count > i)
                {
                    dVal = (session.d_StrokeTimes[i] - session.startTime).ToString();
                }
                markup += "<tr><td>" + kVal +"</td><td>" + dVal + "</td></tr>";
            }

            markup += "</table><br /><br />";
            markup += "</BODY></HTML>";
            return markup;
        }

        private string GetSubSessionMarkup(SubSessionData subSession, int index)
        {
            string markup = string.Empty;

            int timeTableLength = subSession.badTimes.Count;
            if (subSession.goodTimes.Count > timeTableLength)
            {
                timeTableLength = subSession.goodTimes.Count;
            }

            long start = subSession.startTime;
            long end = subSession.endTime;
            long duration = end - start;
            double goodRate = (subSession.goodTimes.Count * 60000) / ((double)duration);
            double badRate = (subSession.badTimes.Count * 60000) / ((double)duration);

            markup += ("Sub-Session[" + (index + 1).ToString() + "] Bad Key: '" + subSession.badKeyCode + "' " + subSession.percentStrokesGood*100 + "% good <br />");
            markup += ("Start : " + start.ToString() + " End: " + end.ToString() + "<br />");
            markup += ("Total good-rate / min: " + goodRate.ToString() + "<br />");
            markup += ("Total bad-rate / min: " + badRate.ToString() + "<br /><br />");

            markup += "Key Stroke Times (ms after sub-session start):";
            markup += "<table><tr><td>Good</td><td>Bad</td>";

            for (int i = 0; i < timeTableLength; i++)
            {
                string goodVal = string.Empty;
                string badVal = string.Empty;
                if (subSession.goodTimes.Count > i)
                {
                    goodVal = (subSession.goodTimes[i] - start).ToString();
                }
                if (subSession.badTimes.Count > i)
                {
                    badVal = (subSession.badTimes[i] - start).ToString();
                }
                markup += "<tr><td>" + goodVal + "</td><td>" + badVal + "</td></tr>";
            }

            markup += "</table><br /><br />";

            return markup;
        }
    }
}
