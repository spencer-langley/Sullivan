using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Sullivan.Models
{
    public class SessionData
    {
        public string SessionType { get; set; }
        public string startTime { get; set; }
        public string endTime { get; set; }
        public List<string> k_StrokeTimes { get; set; }
        public List<string> d_StrokeTimes { get; set; }

        public List<SubSessionData> SubSessions { get; set; }
    }

    public class SubSessionData
    {
        public string badKeyCode { get; set; }
        public List<string> goodTimes { get; set; }
        public List<string> badTimes { get; set; }
        public string percentStrokesGood { get; set; }
    }
}