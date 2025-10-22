"use client";

import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, TextField, 
  Grid as MuiGrid, Card, CardContent, LinearProgress, Alert, Box, 
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, SelectChangeEvent
} from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { AdminLayout } from '../../../components/AdminLayout';
import axios, { AxiosError } from 'axios';

// Create a Grid component that accepts xs and md props
const Grid = (props: any) => <MuiGrid {...props} />;

// Define TypeScript interfaces for our data
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

interface ApiError {
  detail?: string;
  message?: string;
}

/**
 * Call Minutes Admin Page for Super Admins
 * Allows allocation and management of call minutes for all organizations
 */
export default function CallMinutesAdmin() {
  interface User {
    role: string;
  }
  
  const { token, user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [minutesSummary, setMinutesSummary] = useState<MinutesSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Allocation dialog state
  const [allocateDialogOpen, setAllocateDialogOpen] = useState<boolean>(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [minutesToAllocate, setMinutesToAllocate] = useState<number>(60);
  const [allocationReason, setAllocationReason] = useState<string>('');
  
  // Fetch organizations and minutes data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch organizations
        const orgsResponse = await axios.get<Organization[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/organizations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setOrganizations(orgsResponse.data);
        
        // Fetch call minutes summary
        const minutesResponse = await axios.get<MinutesSummary[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/call-minutes/summary`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setMinutesSummary(minutesResponse.data);
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        setError(error.response?.data?.detail || 'Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token && user?.role === 'super_admin') {
      fetchData();
    }
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
        `${process.env.NEXT_PUBLIC_API_URL}/call-minutes/allocate`,
        {
          organization_id: selectedOrg.id,
          minutes_to_allocate: minutesToAllocate,
          allocation_reason: allocationReason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the minutes summary with new data
      const updatedSummary = minutesSummary.map(org => {
        if (org.organization_id === selectedOrg.id) {
          return {
            ...org,
            total_minutes_allocated: org.total_minutes_allocated + minutesToAllocate,
            minutes_remaining: org.minutes_remaining + minutesToAllocate
          };
        }
        return org;
      });
      
      setMinutesSummary(updatedSummary);
      handleCloseAllocateDialog();
      
      // Show success message or notification here if needed
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      setError(error.response?.data?.detail || 'Failed to allocate minutes');
      console.error('Error allocating minutes:', err);
    }
  };

  // Handle activation/deactivation of call minutes
  const handleToggleMinutesStatus = async (orgId: number, currentStatus: boolean) => {
    try {
      const endpoint = currentStatus 
        ? `/call-minutes/organization/${orgId}/deactivate`
        : `/call-minutes/organization/${orgId}/activate`;
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the minutes summary with new status
      const updatedSummary = minutesSummary.map(org => {
        if (org.organization_id === orgId) {
          return {
            ...org,
            is_active: !currentStatus
          };
        }
        return org;
      });
      
      setMinutesSummary(updatedSummary);
      
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      setError(error.response?.data?.detail || 'Failed to update minutes status');
      console.error('Error updating minutes status:', err);
    }
  };

  // Get organization name by ID
  const getOrgName = (orgId: number): string => {
    const org = organizations.find(o => o.id === orgId);
    return org ? org.name : 'Unknown Organization';
  };

  if (!user || user.role !== 'super_admin') {
    return (
      <AdminLayout>
        <Container>
          <Alert severity="error">
            You don't have permission to access this page.
          </Alert>
        </Container>
      </AdminLayout>
    );
  }

  if (!user || (user as User).role !== 'super_admin') {
    return (
      <AdminLayout>
        <Container>
          <Alert severity="error">
            You don't have permission to access this page.
          </Alert>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Call Minutes Management
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <LinearProgress />
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Organizations</Typography>
                    <Typography variant="h3">{organizations.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Orgs with Active Minutes</Typography>
                    <Typography variant="h3">
                      {minutesSummary.filter(m => m.is_active).length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Orgs with No Minutes</Typography>
                    <Typography variant="h3">
                      {organizations.length - minutesSummary.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <FormControl sx={{ minWidth: 200, mr: 2 }}>
                <InputLabel>Filter By</InputLabel>
                <Select defaultValue="all">
                  <MenuItem value="all">All Organizations</MenuItem>
                  <MenuItem value="active">Active Minutes</MenuItem>
                  <MenuItem value="inactive">Inactive Minutes</MenuItem>
                  <MenuItem value="low">Low Minutes</MenuItem>
                  <MenuItem value="exhausted">Exhausted Minutes</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Organization</TableCell>
                    <TableCell align="right">Total Minutes</TableCell>
                    <TableCell align="right">Used Minutes</TableCell>
                    <TableCell align="right">Remaining</TableCell>
                    <TableCell align="right">% Used</TableCell>
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
          </>
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
      </Container>
    </AdminLayout>
  );
}