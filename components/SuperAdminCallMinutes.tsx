"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, TextField, 
  Dialog, DialogTitle, DialogContent, DialogActions, Alert,
  LinearProgress
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000';

interface Organization {
  id: number;
  name: string;
}

interface MinutesSummary {
  organization_id: number;
  organization_name: string;
  total_minutes_allocated: number;
  minutes_used: number;
  minutes_remaining: number;
  percentage_used: number;
  is_active: boolean;
}

const SuperAdminCallMinutes = () => {
  const { token, user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [minutesSummary, setMinutesSummary] = useState<MinutesSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Allocation dialog state
  const [allocateDialogOpen, setAllocateDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [minutesToAllocate, setMinutesToAllocate] = useState(60);
  const [allocationReason, setAllocationReason] = useState('');

  useEffect(() => {
    if (!token || user?.role !== 'super_admin') return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch organizations
        const orgsResponse = await axios.get(
          `${API_URL}/admin/organizations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setOrganizations(orgsResponse.data);
        
        // Fetch call minutes summary
        const minutesResponse = await axios.get(
          `${API_URL}/call-minutes/summary`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setMinutesSummary(minutesResponse.data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || 'Failed to load data';
        setError(errorMessage);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  // Open allocation dialog
  const handleOpenAllocateDialog = (org: Organization) => {
    setSelectedOrg(org);
    setAllocateDialogOpen(true);
  };

  // Close allocation dialog
  const handleCloseAllocateDialog = () => {
    setAllocateDialogOpen(false);
    setSelectedOrg(null);
    setMinutesToAllocate(60);
    setAllocationReason('');
  };

  // Handle minutes allocation
  const handleAllocateMinutes = async () => {
    if (!selectedOrg) return;
    
    try {
      await axios.post(
        `${API_URL}/call-minutes/allocate`,
        {
          organization_id: selectedOrg.id,
          minutes_to_allocate: minutesToAllocate,
          allocation_reason: allocationReason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh the data
      const minutesResponse = await axios.get(
        `${API_URL}/call-minutes/summary`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMinutesSummary(minutesResponse.data);
      handleCloseAllocateDialog();
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to allocate minutes';
      setError(errorMessage);
      console.error('Error allocating minutes:', err);
    }
  };

  // Handle activation/deactivation of call minutes
  const handleToggleMinutesStatus = async (orgId: number, currentStatus: boolean) => {
    try {
      const endpoint = currentStatus 
        ? `${API_URL}/call-minutes/organization/${orgId}/deactivate`
        : `${API_URL}/call-minutes/organization/${orgId}/activate`;
      
      await axios.post(
        endpoint,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh the data
      const minutesResponse = await axios.get(
        `${API_URL}/call-minutes/summary`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMinutesSummary(minutesResponse.data);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to update minutes status';
      setError(errorMessage);
      console.error('Error updating minutes status:', err);
    }
  };

  if (!user || user.role !== 'super_admin') {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        You don't have permission to access this feature.
      </Alert>
    );
  }

  return (
    <div>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Organization Call Minutes Management
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Allocate and manage call minutes for all organizations from this dashboard.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button size="small" onClick={() => setError(null)} sx={{ ml: 2 }}>
            Dismiss
          </Button>
        </Alert>
      )}

      {loading ? (
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Organization</TableCell>
                <TableCell align="right">Total Minutes</TableCell>
                <TableCell align="right">Used Minutes</TableCell>
                <TableCell align="right">Remaining</TableCell>
                <TableCell align="right">Usage %</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {organizations.map((org) => {
                const minutesData = minutesSummary.find(m => m.organization_id === org.id) || {
                  total_minutes_allocated: 0,
                  minutes_used: 0,
                  minutes_remaining: 0,
                  percentage_used: 0,
                  is_active: false
                };
                
                const percentUsed = minutesData.total_minutes_allocated > 0
                  ? (minutesData.minutes_used / minutesData.total_minutes_allocated * 100).toFixed(1)
                  : '0';
                  
                return (
                  <TableRow key={org.id}>
                    <TableCell>{org.name}</TableCell>
                    <TableCell align="right">{minutesData.total_minutes_allocated}</TableCell>
                    <TableCell align="right">{minutesData.minutes_used}</TableCell>
                    <TableCell align="right">{minutesData.minutes_remaining}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(Number(percentUsed), 100)} 
                            color={
                              Number(percentUsed) >= 90 ? 'error' : 
                              Number(percentUsed) >= 75 ? 'warning' : 'success'
                            }
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">{percentUsed}%</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {minutesData.total_minutes_allocated === 0 ? (
                        <Alert severity="warning" sx={{ py: 0 }}>No Minutes</Alert>
                      ) : minutesData.is_active ? (
                        <Alert severity="success" sx={{ py: 0 }}>Active</Alert>
                      ) : (
                        <Alert severity="error" sx={{ py: 0 }}>Inactive</Alert>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => handleOpenAllocateDialog(org)}
                        sx={{ mr: 1 }}
                      >
                        Add Minutes
                      </Button>
                      
                      {minutesData.total_minutes_allocated > 0 && (
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color={minutesData.is_active ? "error" : "success"}
                          onClick={() => handleToggleMinutesStatus(org.id, minutesData.is_active)}
                        >
                          {minutesData.is_active ? "Deactivate" : "Activate"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Allocate Minutes Dialog */}
      <Dialog open={allocateDialogOpen} onClose={handleCloseAllocateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Allocate Call Minutes - {selectedOrg?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Minutes to Allocate"
            type="number"
            fullWidth
            variant="outlined"
            value={minutesToAllocate}
            onChange={(e) => setMinutesToAllocate(Number(e.target.value))}
            InputProps={{ inputProps: { min: 1 } }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Reason (optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={allocationReason}
            onChange={(e) => setAllocationReason(e.target.value)}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAllocateDialog}>Cancel</Button>
          <Button onClick={handleAllocateMinutes} variant="contained" color="primary">
            Allocate Minutes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SuperAdminCallMinutes;