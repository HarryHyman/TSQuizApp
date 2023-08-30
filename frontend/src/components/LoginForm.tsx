import { Button, Card, Form, Input } from "antd";
import { Link } from "react-router-dom";

const LoginForm = () => {
    const [ form ] = Form.useForm();

    const title = <h1 style={{margin: "12px 0"}}>Login</h1>

    return (
        <div className="register_login__backdrop">
        <Card style={{ maxWidth: "600px", width: "100%" }} title={title}>
            <Form
                form={form}
                layout="vertical"
                name="login-form"
                requiredMark="optional"
            >
                <Form.Item
                    name="identifier"
                    label="Username / Email"
                    tooltip="The username or email address you registered with."
                    rules={[{ required: true, message: "Please input either your username or email address" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                    <p style={{marginBottom: "0"}}>Don't have an account?
                        <Link to="/register"> Register</Link>
                    </p>
                </Form.Item>
            </Form>
        </Card>
        </div>
    )
};

export default LoginForm;