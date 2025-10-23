# SuperAdmin Call Minutes - Reset Functionality

## Updated Features

The SuperAdmin Call Minutes component now has enhanced reset functionality:

### Reset Options Available:

1. **Reset Minutes** (Dialog-based)
   - Opens a dialog where you can specify the exact amount to reset to
   - Allows you to set available balance to any specific number
   - Includes reason field for audit tracking
   - Full control over the reset amount

2. **Reset to 0** (Quick Action)
   - One-click button to immediately reset organization minutes to zero
   - Shows confirmation dialog to prevent accidental resets
   - Automatically adds audit reason "Quick reset to zero minutes by super admin"
   - Perfect for quickly clearing an organization's minutes

### Button Layout:

The buttons are now organized in a responsive flex layout:

```
[Add Minutes] [Reset Minutes] [Reset to 0] [Activate/Deactivate]
```

### How Reset Works:

When you use either reset option, the system:

1. **Preserves used minutes**: The "used" amount stays the same
2. **Calculates new total**: Sets `total_allocated = used + new_available_amount`
3. **Updates available balance**: Results in exactly the amount you specified being available
4. **Logs the action**: Creates audit trail in allocation history
5. **Sends notification**: Notifies the organization of the change

### Example:

If an organization has:
- Total Allocated: 100 minutes
- Used: 75 minutes  
- Available: 25 minutes

When you "Reset to 50":
- Total Allocated: 125 minutes (75 used + 50 available)
- Used: 75 minutes (unchanged)
- Available: 50 minutes (exactly what you set)

When you "Reset to 0":
- Total Allocated: 75 minutes (75 used + 0 available)
- Used: 75 minutes (unchanged) 
- Available: 0 minutes (reset to zero)

### API Integration:

Both reset options use the existing `/call-minutes/allocate` endpoint with:
- `allocation_type: "reset"`
- `minutes_to_allocate: <desired_available_amount>`

This ensures consistency with the existing backend logic and maintains full audit trails.