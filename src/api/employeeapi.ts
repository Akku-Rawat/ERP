/**
 * Verify employee identity using NRC or SSN (NAPSA)
 */
export async function verifyEmployeeIdentity(
  identityType: 'NRC' | 'SSN',
  identityNumber: string
) {
  try {
    const response = await fetch(
      `/api/v1/employees/verify?identityType=${identityType}&identityNumber=${encodeURIComponent(identityNumber)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw data;
    }
    
    return data;
  } catch (error: any) {
    throw {
      success: false,
      message: error.message || 'Failed to verify employee identity',
      error: error.error || { code: 'VERIFICATION_FAILED' },
    };
  }
}

/**
 * Create new employee with complete data
 */
export async function createEmployeeComplete(employeeData: any) {
  try {
    const response = await fetch('/api/v1/employees', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw data;
    }
    
    return data;
  } catch (error: any) {
    throw {
      success: false,
      message: error.message || 'Failed to create employee',
      error: error.error || { code: 'CREATE_FAILED' },
      errors: error.errors || [],
    };
  }
}

function getAuthToken(): string {
  // Your auth token logic here
  return localStorage.getItem('authToken') || '';
}