import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../services/userService';

// Helper functions for cookie management
const setCookie = (name, value, days = 90) => { // 90 days = ~3 months
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/; SameSite=Lax; Secure";
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

export const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load addresses on mount
  useEffect(() => {
    const loadAddresses = async () => {
      setLoading(true);
      try {
        const stored = getCookie('plmart_addresses');
        if (stored && Array.isArray(stored) && stored.length > 0) {
          setAddresses(stored);
        } else {
          // If no stored addresses in cookie, fetch from User Profile API
          const profile = await userApi.getProfile();
          if (profile) {
            const initialAddress = {
              id: Date.now(),
              type: 'Nhà riêng',
              isDefault: true,
              receiver: profile.fullName || 'Người nhận',
              phone: profile.phoneNumber || '',
              detail: '123 Đường ABC, Phường X, Quận Y, TP. Hồ Chí Minh' // Default address detail
            };
            const list = [initialAddress];
            setCookie('plmart_addresses', list, 90); // 3 months
            setAddresses(list);
          }
        }
      } catch (error) {
        console.error("Error loading addresses from cookie/API:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  // Save helper
  const saveAddresses = useCallback((newList) => {
    setAddresses(newList);
    setCookie('plmart_addresses', newList, 90);
  }, []);

  // Add a new address
  const addAddress = useCallback((newAddr) => {
    const id = Date.now();
    let updated = [...addresses];
    
    if (newAddr.isDefault) {
      updated = updated.map(addr => ({ ...addr, isDefault: false }));
    }
    
    const isDefault = updated.length === 0 ? true : newAddr.isDefault;

    const fullAddr = {
      ...newAddr,
      id,
      isDefault
    };
    
    const newList = [...updated, fullAddr];
    saveAddresses(newList);
    return fullAddr;
  }, [addresses, saveAddresses]);

  // Update address fields
  const updateAddress = useCallback((id, updatedFields) => {
    let updated = addresses.map(addr => {
      if (addr.id === id) {
        return { ...addr, ...updatedFields };
      }
      return addr;
    });

    if (updatedFields.isDefault) {
      updated = updated.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }));
    }

    saveAddresses(updated);
  }, [addresses, saveAddresses]);

  // Delete address by ID
  const deleteAddress = useCallback((id) => {
    const toDelete = addresses.find(addr => addr.id === id);
    let updated = addresses.filter(addr => addr.id !== id);
    
    // If we deleted the default address, make the first remaining address the default
    if (toDelete?.isDefault && updated.length > 0) {
      updated[0] = { ...updated[0], isDefault: true };
    }
    
    saveAddresses(updated);
  }, [addresses, saveAddresses]);

  // Set address as default
  const setAsDefault = useCallback((id) => {
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    saveAddresses(updated);
  }, [addresses, saveAddresses]);

  return {
    addresses,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setAsDefault
  };
};
