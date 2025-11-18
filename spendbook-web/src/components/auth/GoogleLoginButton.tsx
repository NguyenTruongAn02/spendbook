import { useAuth } from '@/contexts/AuthContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { message } from 'antd';

export default function GoogleLoginButton() {
    const { loginWithGoogle } = useAuth();

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const idToken = credentialResponse.credential;
            if (!idToken) {
                message.error('Không lấy được token từ Google');
                return;
            }

            await loginWithGoogle(idToken);
            message.success('Đăng nhập thành công');
        } catch (err) {
            console.error(err);
            message.error('Đăng nhập thất bại');
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
                message.error('Google login thất bại');
            }}
        />
    );
}
