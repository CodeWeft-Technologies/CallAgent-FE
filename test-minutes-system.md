# Call Minutes System Test Guide

## ✅ Complete Real-time Call Minutes Implementation

### **Testing Checklist:**

#### **1. Super Admin Dashboard (Real-time Updates)**
- [ ] Navigate to `/admin` 
- [ ] Verify "Real-time Updates" section is visible
- [ ] Check "Live" indicator shows when enabled
- [ ] Toggle real-time updates on/off
- [ ] Verify polling happens every 30 seconds when enabled

#### **2. Call Minutes Allocation**
- [ ] Access Super Admin Dashboard
- [ ] Select an organization from the list
- [ ] Click "Allocate Minutes" button
- [ ] Allocate test minutes (e.g., 10 minutes)
- [ ] Verify allocation appears in organization card
- [ ] Check activation/deactivation toggle works

#### **3. Pre-call Minute Checking**
- [ ] Navigate to `/leads` 
- [ ] Ensure organization has limited minutes (e.g., 5 minutes)
- [ ] Try to initiate a single call
- [ ] Verify system estimates duration and checks availability
- [ ] Try batch calling with insufficient minutes
- [ ] Confirm calls are blocked when minutes exhausted

#### **4. Minutes Exhausted Modal**
- [ ] Set organization minutes to 0 or deactivate
- [ ] Attempt to make a call from `/leads`
- [ ] Verify modal pops up with clear message
- [ ] Check sales contact information is displayed
- [ ] Test "Contact Sales" button functionality

#### **5. Real-time Consumption Tracking**
- [ ] Make a test call with sufficient minutes
- [ ] Complete the call (let it run for 1-2 minutes)
- [ ] Check webhook logs for minute consumption
- [ ] Verify database updates in real-time
- [ ] Confirm super admin dashboard reflects usage

### **Database Verification:**
```sql
-- Check organization minutes
SELECT * FROM organization_call_minutes WHERE organization_id = [ORG_ID];

-- Check usage logs
SELECT * FROM call_minutes_usage_log WHERE organization_id = [ORG_ID] ORDER BY created_at DESC;

-- Check allocation history
SELECT * FROM call_minutes_allocation_history WHERE organization_id = [ORG_ID] ORDER BY allocated_at DESC;
```

### **API Testing:**
```bash
# Check minutes availability
curl -X POST "http://localhost:8000/call-minutes/check-availability" \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"organization_id": 1, "estimated_duration_minutes": 3}'

# Consume minutes (internal testing)
curl -X POST "http://localhost:8000/call-minutes/consume" \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "organization_id": 1,
    "call_id": "test_call_123",
    "minutes_consumed": 2,
    "call_start_time": "2025-10-23T10:00:00",
    "call_end_time": "2025-10-23T10:02:00"
  }'
```

### **Key Features Implemented:**

#### **Frontend:**
- ✅ `useCallMinutes.ts` - Comprehensive minute management hook
- ✅ `MinutesExhaustedModal.tsx` - User-friendly exhaustion notifications
- ✅ Real-time polling dashboard with live indicators
- ✅ Pre-call validation integrated into leads page
- ✅ Call blocking when minutes unavailable

#### **Backend:**
- ✅ `/check-availability` - Pre-call minute validation
- ✅ `/consume` - Post-call minute consumption  
- ✅ `consume_call_minutes_internal()` - System-level usage tracking
- ✅ Webhook integration for automatic consumption on call completion
- ✅ Database logging and real-time updates

#### **Integration Points:**
- ✅ Individual call initiation (`handleCallLead`)
- ✅ Batch calling (`handleCallAll`)
- ✅ Call completion webhook tracking
- ✅ Real-time dashboard updates
- ✅ Organization identification from call records

### **Expected Behaviors:**

1. **Before Call:** System checks availability and blocks if insufficient
2. **During Call:** System allows call to proceed if pre-validated
3. **After Call:** Webhook automatically tracks actual consumption
4. **Real-time:** Dashboard updates every 30 seconds showing live usage
5. **User Experience:** Clear notifications and contact info when exhausted

### **Success Criteria:**
- [ ] No calls allowed when minutes exhausted
- [ ] Accurate real-time consumption tracking
- [ ] Clear user feedback and guidance
- [ ] Reliable system integration across all components
- [ ] Live dashboard updates for administrators

---

**System Status: ✅ FULLY IMPLEMENTED AND READY FOR TESTING**

The complete real-time call minutes tracking and enforcement system is now operational with comprehensive frontend integration, backend automation, and user-friendly notifications.