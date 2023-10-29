import { Button, Card, Form, Input } from "antd";
import { Link } from "react-router-dom";

const RegisterForm = () => {
    const [ form ] = Form.useForm();

    const title = <h1 style={{margin: "12px 0"}}>Register</h1>

    return (
        <div className="register_login__backdrop">
        <Card style={{ maxWidth: "600px", width: "100%" }} title={title}>
            <Form
                form={form}
                layout="vertical"
                name="register-form"
                requiredMark="optional"
            >
                <Form.Item
                    name="username"
                    label="Username"
                    tooltip="What username would you like to log in with?"
                    rules={[{ required: true, message: "Please input your username!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="displayName"
                    label="Display Name"
                    tooltip="What name would you like to be displayed to others?"
                    rules={[{ required: true, message: "Please input your display name!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    tooltip="What email would you like to log in with?"
                    rules={[
                        { required: true, message: "Please input your email!" },
                        { type: "email", message: "Please input a valid email!" }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    tooltip="What password would you like to log in with?"
                    rules={[{ required: true, message: "Please input your password!" }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    tooltip="Please confirm your password."
                    rules={[
                        { required: true, message: "Please confirm your password!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("The two passwords that you entered do not match!"));
                            },
                        })
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                    <p style={{marginBottom: "0"}}>Already have an account?
                        <Link to="/login"> Login</Link>
                    </p>
                </Form.Item>
            </Form>
        </Card>
        </div>
    )
};

export default RegisterForm;