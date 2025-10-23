// Real-time Minutes WebSocket Client
// Add this to your admin interface to receive real-time minute updates

class RealTimeMinutesClient {
    constructor(organizationId, baseUrl = 'ws://localhost:8000') {
        this.organizationId = organizationId;
        this.baseUrl = baseUrl;
        this.websocket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 3000;
        this.heartbeatInterval = 30000;
        this.heartbeatTimer = null;
        
        // Callbacks for different event types
        this.onMinuteUpdate = null;
        this.onInitialState = null;
        this.onConnected = null;
        this.onDisconnected = null;
        this.onError = null;
    }
    
    connect() {
        try {
            const wsUrl = `${this.baseUrl}/call-minutes/realtime-minutes/${this.organizationId}`;
            console.log(`📡 Connecting to real-time minutes WebSocket: ${wsUrl}`);
            
            this.websocket = new WebSocket(wsUrl);
            
            this.websocket.onopen = (event) => {
                console.log('📡 Real-time minutes WebSocket connected');
                this.reconnectAttempts = 0;
                this.startHeartbeat();
                
                if (this.onConnected) {
                    this.onConnected(event);
                }
            };
            
            this.websocket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    console.log('📡 Received minute update:', message);
                    
                    switch (message.type) {
                        case 'initial_state':
                            console.log('📊 Initial minute state:', message.data);
                            if (this.onInitialState) {
                                this.onInitialState(message.data);
                            }
                            break;
                            
                        case 'minute_update':
                            console.log('🔄 Real-time minute update:', message.data);
                            if (this.onMinuteUpdate) {
                                this.onMinuteUpdate(message.data);
                            }
                            
                            // Update UI elements if they exist
                            this.updateUI(message.data);
                            break;
                            
                        case 'heartbeat_ack':
                            console.log('💓 Heartbeat acknowledged');
                            break;
                            
                        default:
                            console.log('📡 Unknown message type:', message.type);
                    }
                } catch (error) {
                    console.error('📡 Error parsing WebSocket message:', error);
                }
            };
            
            this.websocket.onclose = (event) => {
                console.log('📡 Real-time minutes WebSocket disconnected');
                this.stopHeartbeat();
                
                if (this.onDisconnected) {
                    this.onDisconnected(event);
                }
                
                // Attempt to reconnect
                this.attemptReconnect();
            };
            
            this.websocket.onerror = (error) => {
                console.error('📡 Real-time minutes WebSocket error:', error);
                
                if (this.onError) {
                    this.onError(error);
                }
            };
            
        } catch (error) {
            console.error('📡 Error connecting to WebSocket:', error);
        }
    }
    
    disconnect() {
        console.log('📡 Manually disconnecting WebSocket');
        this.stopHeartbeat();
        
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
    }
    
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`📡 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            
            setTimeout(() => {
                this.connect();
            }, this.reconnectInterval);
        } else {
            console.error('📡 Max reconnection attempts reached');
        }
    }
    
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                this.websocket.send(JSON.stringify({
                    type: 'heartbeat',
                    timestamp: new Date().toISOString()
                }));
            }
        }, this.heartbeatInterval);
    }
    
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }
    
    updateUI(minuteData) {
        // Update UI elements automatically if they exist
        
        // Update total allocated
        const totalElement = document.getElementById(`org-${this.organizationId}-total-minutes`);
        if (totalElement) {
            totalElement.textContent = minuteData.total_minutes_allocated;
        }
        
        // Update used minutes
        const usedElement = document.getElementById(`org-${this.organizationId}-used-minutes`);
        if (usedElement) {
            usedElement.textContent = minuteData.minutes_used;
        }
        
        // Update remaining minutes
        const remainingElement = document.getElementById(`org-${this.organizationId}-remaining-minutes`);
        if (remainingElement) {
            remainingElement.textContent = minuteData.minutes_remaining;
            
            // Add visual feedback for low minutes
            if (minuteData.minutes_remaining <= 0) {
                remainingElement.style.color = '#ef4444'; // Red for no minutes
            } else if (minuteData.minutes_remaining < 10) {
                remainingElement.style.color = '#f59e0b'; // Orange for low minutes
            } else {
                remainingElement.style.color = '#10b981'; // Green for good
            }
        }
        
        // Update progress bar
        const progressElement = document.getElementById(`org-${this.organizationId}-progress-bar`);
        if (progressElement) {
            const percentage = minuteData.percentage_used || 0;
            progressElement.style.width = `${Math.min(percentage, 100)}%`;
            
            // Change color based on usage
            if (percentage >= 90) {
                progressElement.style.backgroundColor = '#ef4444'; // Red
            } else if (percentage >= 75) {
                progressElement.style.backgroundColor = '#f59e0b'; // Orange
            } else {
                progressElement.style.backgroundColor = '#10b981'; // Green
            }
        }
        
        // Show toast notification for new consumption
        if (minuteData.minutes_consumed_now > 0) {
            this.showToast(`${minuteData.minutes_consumed_now} minutes consumed for ${minuteData.call_direction} call`);
        }
    }
    
    showToast(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #374151;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
            font-size: 14px;
        `;
        toast.textContent = `📞 ${message}`;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
    }
}

// Usage Example:
/*
// Initialize for organization 17
const minutesClient = new RealTimeMinutesClient(17);

// Set up event handlers
minutesClient.onMinuteUpdate = (data) => {
    console.log('New minute consumption:', data);
    // Update your UI here
};

minutesClient.onInitialState = (data) => {
    console.log('Initial minute state:', data);
    // Set up initial UI state
};

minutesClient.onConnected = () => {
    console.log('Connected to real-time updates');
    // Show connection indicator
};

minutesClient.onDisconnected = () => {
    console.log('Disconnected from real-time updates');
    // Show disconnection indicator
};

// Connect
minutesClient.connect();

// Later, when leaving the page
// minutesClient.disconnect();
*/