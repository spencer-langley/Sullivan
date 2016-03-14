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
        public long startTime { get; set; }
        public long endTime { get; set; }
        public string startDateTime { get; set; }
        public string endDateTime { get; set; }
        public List<long> k_StrokeTimes { get; set; }
        public List<long> d_StrokeTimes { get; set; }

        public List<SubSessionData> SubSessions { get; set; }

        public SessionData()
        {
            k_StrokeTimes = new List<long>();
            d_StrokeTimes = new List<long>();
            SubSessions = new List<SubSessionData>();
        }
    }

    public class SubSessionData
    {
        public long startTime { get; set; }
        public long endTime { get; set; }
        public string badKeyCode { get; set; }
        public List<long> goodTimes { get; set; }
        public List<long> badTimes { get; set; }
        public double percentStrokesGood { get; set; }

        public SubSessionData()
        {
            goodTimes = new List<long>();
            badTimes = new List<long>();
        }
    }
}