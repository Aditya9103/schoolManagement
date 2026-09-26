import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../auth/LoginPage';
import { renderWithProviders } from '../testUtils';

describe('Frontend LoginPage Component & Interaction Tests', () => {
    it('should render login page with branding, inputs, and submit button', () => {
        renderWithProviders(<LoginPage />);

        // Branding and titles
        expect(screen.getAllByText(/PrimeSchoolOs/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Welcome Back/i).length).toBeGreaterThan(0);

        // Inputs
        const identifierInputs = screen.getAllByPlaceholderText(/Email or Mobile Number/i);
        expect(identifierInputs.length).toBeGreaterThan(0);

        const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
        expect(passwordInputs.length).toBeGreaterThan(0);

        // Submit Button
        const submitButtons = screen.getAllByRole('button', { name: /Sign In/i });
        expect(submitButtons.length).toBeGreaterThan(0);
    });

    it('should toggle between Password login and OTP login methods', async () => {
        renderWithProviders(<LoginPage />);

        // Find "Sign in with OTP instead" button
        const otpSwitchButtons = screen.getAllByRole('button', { name: /Sign in with OTP instead/i });
        expect(otpSwitchButtons.length).toBeGreaterThan(0);

        fireEvent.click(otpSwitchButtons[0]);

        // When in OTP mode, "Send OTP" button appears
        await waitFor(() => {
            const sendOtpBtns = screen.getAllByText(/Send OTP/i);
            expect(sendOtpBtns.length).toBeGreaterThan(0);
        });

        // Switch back to password
        const passwordSwitchButtons = screen.getAllByRole('button', { name: /Sign in with Password instead/i });
        fireEvent.click(passwordSwitchButtons[0]);

        await waitFor(() => {
            const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
            expect(passwordInputs.length).toBeGreaterThan(0);
        });
    });

    it('should show error when trying to send OTP without entering an identifier', async () => {
        renderWithProviders(<LoginPage />);

        // Switch to OTP mode
        const otpSwitchButtons = screen.getAllByRole('button', { name: /Sign in with OTP instead/i });
        fireEvent.click(otpSwitchButtons[0]);

        // Click "Send OTP" without filling identifier
        const sendOtpBtns = screen.getAllByText(/Send OTP/i);
        fireEvent.click(sendOtpBtns[0]);

        // Error message appears
        await waitFor(() => {
            expect(screen.getAllByText(/Please enter your email or mobile number first/i).length).toBeGreaterThan(0);
        });
    });

    it('should allow toggling password visibility', async () => {
        renderWithProviders(<LoginPage />);

        const passwordInputs = screen.getAllByPlaceholderText(/^Password$/i);
        expect(passwordInputs.length).toBeGreaterThan(0);

        const passwordInput = passwordInputs[0];
        expect(passwordInput.type).toBe('password');

        // Find the visibility toggle button
        const toggleButtons = passwordInput.parentElement.querySelectorAll('button');
        if (toggleButtons.length > 0) {
            fireEvent.click(toggleButtons[0]);
            expect(passwordInput.type).toBe('text');

            fireEvent.click(toggleButtons[0]);
            expect(passwordInput.type).toBe('password');
        }
    });

    it('should open Contact School Modal when Help button is clicked', async () => {
        renderWithProviders(<LoginPage />);

        const contactSchoolButtons = screen.getAllByRole('button', { name: /Contact School/i });
        expect(contactSchoolButtons.length).toBeGreaterThan(0);

        fireEvent.click(contactSchoolButtons[0]);

        await waitFor(() => {
            expect(screen.getByText(/Contact School Administration/i)).toBeInTheDocument();
        });
    });

    it('should display invited school activation banner, prefill email, and allow auto-filling temporary password', async () => {
        renderWithProviders(<LoginPage />, {
            route: '/login?invitedSchool=JPS%20Bal%20Vidya%20Mandir&email=admin%40jpsbvm.edu.in',
        });

        // Activation banner
        expect(screen.getByText(/Administrator Account Activation/i)).toBeInTheDocument();
        expect(screen.getByText(/JPS Bal Vidya Mandir/i)).toBeInTheDocument();

        // Email prefilled
        const identifierInput = screen.getByPlaceholderText(/Email or Mobile Number/i);
        expect(identifierInput.value).toBe('admin@jpsbvm.edu.in');

        // Initial password auto-fill
        const autoFillBtn = screen.getByRole('button', { name: /Auto-fill/i });
        expect(autoFillBtn).toBeInTheDocument();
        fireEvent.click(autoFillBtn);

        const passwordInput = screen.getByPlaceholderText(/Password/i);
        expect(passwordInput.value).toBe('Password@123');
    });
});
