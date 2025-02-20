// Profile.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess
} from '../redux/user/userSlice';

export default function Profile() {
    const { currentUser, loading, error } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: currentUser?.username || '',
        email: currentUser?.email || '',
        password: '',
        profilePicture: currentUser?.profilePicture || ''
    });

    const [updateError, setUpdateError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setUpdateError(null); // Clear errors when user starts typing
    };

    const validateForm = () => {
        if (formData.username) {
            if (formData.username.length < 7 || formData.username.length > 20) {
                setUpdateError('Username must be between 7 and 20 characters');
                return false;
            }
            if (formData.username.includes(' ')) {
                setUpdateError('Username cannot contain spaces');
                return false;
            }
            if (formData.username !== formData.username.toLowerCase()) {
                setUpdateError('Username must be lowercase');
                return false;
            }
            if (!formData.username.match(/^[a-zA-Z0-9]+$/)) {
                setUpdateError('Username can only contain letters and numbers');
                return false;
            }
        }

        if (formData.password && formData.password.length < 6) {
            setUpdateError('Password must be at least 6 characters');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            dispatch(updateStart());

            // Only include fields that have been changed
            const updatedFields = Object.entries(formData).reduce((acc, [key, value]) => {
                if (value && value !== currentUser[key]) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            if (Object.keys(updatedFields).length === 0) {
                dispatch(updateFailure('No changes to update'));
                return;
            }

            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFields),
            });

            const data = await res.json();

            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateError(data.message);
                return;
            }

            dispatch(updateSuccess(data));
            setUpdateError(null);
            // Clear password field after successful update
            setFormData(prev => ({ ...prev, password: '' }));
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateError(error.message);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                dispatch(deleteUserStart());
                const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                    method: 'DELETE',
                });

                if (!res.ok) {
                    const data = await res.json();
                    dispatch(deleteUserFailure(data.message));
                    return;
                }

                dispatch(deleteUserSuccess());
                navigate('/sign-in');
            } catch (error) {
                dispatch(deleteUserFailure(error.message));
            }
        }
    };

    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });

            if (!res.ok) {
                const data = await res.json();
                console.error(data.message);
                return;
            }

            dispatch(signoutSuccess());
            navigate('/sign-in');
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    {(error || updateError) && (
                        <div className="mb-4 p-4 text-sm text-red-500 bg-red-50 rounded-md">
                            {error || updateError}
                        </div>
                    )}

                    <div className="flex flex-col items-center mb-6">
                        <Avatar className="w-24 h-24 mb-4">
                            <AvatarImage src={currentUser?.profilePicture} />
                            <AvatarFallback>{currentUser?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <Input
                            type="text"
                            id="profilePicture"
                            placeholder="Profile Picture URL"
                            defaultValue={currentUser?.profilePicture}
                            onChange={handleChange}
                            className="max-w-[300px]"
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                type="text"
                                id="username"
                                placeholder="Username (7-20 characters, lowercase letters and numbers only)"
                                defaultValue={currentUser?.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="Email"
                                defaultValue={currentUser?.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                type="password"
                                id="password"
                                placeholder="Leave blank to keep current password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSignOut}
                                className="w-full"
                            >
                                Sign Out
                            </Button>

                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                className="w-full"
                            >
                                Delete Account
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}