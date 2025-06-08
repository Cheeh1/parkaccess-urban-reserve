import * as yup from 'yup';

export const companySchema = yup.object().shape({
    companyName: yup.string().required('Company name is required'),
    companyEmail: yup.string().email('Email is invalid').required('Email is required'),
    companyPassword: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

  export const userSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Email is invalid').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  export const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  export const changePasswordSchema = yup.object({
    oldPassword: yup.string().required('Current password is required'),
    newPassword: yup
      .string()
      .required('New password is required')
      .min(8, 'Password must be at least 8 characters'),
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      // ),
    confirmPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('newPassword')], 'Passwords must match'),
  });