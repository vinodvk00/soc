// OAuth.jsx
import { Button } from "@/components/ui/button"
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';

const GoogleIcon = (props) => (
    <svg 
        role="img" 
        viewBox="0 0 24 24" 
        className="h-4 w-4 mr-2"
        {...props}
    >
        <path
            fill="currentColor"
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
        />
    </svg>
);

export default function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                    role: 'user', // Changed from 'analyst' to 'user'
                    lastLogin: new Date().toISOString(),
                }),
            });

            const data = await res.json();
            
            if (res.ok) {
                dispatch(signInSuccess({
                    ...data,
                    accessLevel: data.accessLevel || 'basic',
                    department: data.department || 'SOC',
                }));
                navigate('/');
            } else {
                throw new Error(data.message || 'Failed to authenticate');
            }
        } catch (error) {
            console.error('Authentication Error:', error);
        }
    };

    return (
        <Button 
            variant="outline"
            onClick={handleGoogleClick}
            className="w-full max-w-sm bg-white text-black hover:bg-gray-100"
        >
            <GoogleIcon />
            Sign in with Google
        </Button>
    );
}