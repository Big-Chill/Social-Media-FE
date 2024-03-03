import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import validator from 'validator';
import { Button, Checkbox, Input } from "@material-tailwind/react";
import { toaster } from 'evergreen-ui';
import { AnimatePresence, motion } from 'framer-motion';
import { localStore } from '../../services/browserStorage';
import { useHistory } from 'react-router-dom'
import { AuthService } from '../../services/endpoints';



const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'linear-gradient(180deg, #ffffff 0%, #f2f2f2 100%)'
  },

  card: {
    width: '90%',
    maxWidth: '600px',
    margin: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0px 0px 40px rgba(0, 0, 0, 0.15)',
    border: '2px solid #f2f2f2',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.2)',
    },
  },

  header: {
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
  },

  input: {
    width: '100%',
    marginBottom: '20px',
  },

  button: {
    width: '100%',
    marginBottom: '20px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
    color: '#FFF',
    transition: '0.3s',
    '&:hover': {
      background: 'linear-gradient(45deg, #FE4A4A 30%, #FF7B3D 90%)',
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
      color: '#FFF',
    },
  },

  switch: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
    '& .MuiSwitch-thumb': {
      backgroundColor: '#FF6B6B',
      '&.Mui-checked': {
        backgroundColor: '#4CAF50',
      },
    },
    '& .MuiSwitch-track': {
      backgroundColor: '#e0e0e0',
    },
    '& .MuiTypography-root': {
      color: '#A5A5A5',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    '& .Mui-checked .MuiTypography-root': {
      color: '#4CAF50',
    },
  },
};



const Auth = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [typeOfAuth, setTypeOfAuth] = React.useState('login');
  const [checked, setChecked] = React.useState(typeOfAuth === 'login' ? false : true);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const history = useHistory();

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setTypeOfAuth(event.target.checked ? 'signup' : 'login');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const validateEmail = (email) => {
    return validator.isEmail(email);
  };

  const validatePassword = (password) => {
    return validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
  };


  const generateToaster = (type, message) => {
    switch (type) {
      case 'success':
        toaster.success(message, { duration: 0.7, zIndex: 1000, hasCloseButton: false });
        break;
      case 'danger':
        toaster.danger(message, { duration: 0.7, zIndex: 1000, hasCloseButton: false });
        break;
      default:
        break;
    }
  };

  const handleButtonClick = async() => {
    switch (typeOfAuth) {
      case 'login':
        try {
          await AuthService.login({email, password});
          history.push('/');
          generateToaster('success', 'Login Successful');
        } catch (error) {
          generateToaster('danger', error.response.data.message);
        }
        break;
      case 'signup':
        try {
          if (!validateEmail(email)) {
            generateToaster('danger', 'Invalid Email');
            return;
          }
          if (!validatePassword(password)) {
            generateToaster('danger', 'Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol');
            return;
          }
          if (!validateConfirmPassword(password, confirmPassword)) {
            generateToaster('danger', 'Passwords do not match');
            return;
          }
          await AuthService.register({email, password});
          setTypeOfAuth('login');
          await AuthService.login({ email, password });
          history.push('/');
          generateToaster('success', 'Signup Successful');
        } catch (error) {
          generateToaster('danger', error.response.data.message);
        }
        break;
      default:
        break;
    };
  };


  React.useEffect(() => {
    if (localStore.get('jwtToken')) {
      history.push('/');
    }
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);





  return (
    <Box sx={styles.container}>
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.1 }}
            transition={{ duration: 0.5 }}
          >
            <Card raised={true} sx={{ ...styles.card, background: typeOfAuth === 'login' ? '#f0f0f0' : '#e6f7ff' }}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ ...styles.header, color: typeOfAuth === 'login' ? '#333' : '#007bff' }}>
                  {typeOfAuth === 'login' ? 'Login' : 'Sign Up'}
                </Typography>
                <FormControl sx={styles.input}>
                  <Input
                    variant="outlined"
                    label="Email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ width: '100%', maxWidth: '100%' }}
                  />
                </FormControl>
                <FormControl sx={styles.input}>
                  <div className="relative flex w-full">
                    <Input
                    variant="outlined"
                    label="Password"
                    type={'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ width: '100%', maxWidth: '100%' }}
                    />
                  </div>
                </FormControl>

                {
                  typeOfAuth === 'signup' && (
                    <FormControl sx={styles.input}>
                      <Input
                        variant="outlined"
                        label="Confirm Password"
                        type={'password'}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={{ width: '100%', maxWidth: '100%' }}
                      />
                    </FormControl>
                  )
                }


                {typeOfAuth === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <FormControlLabel
                      control={<Checkbox color="green" defaultChecked checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
                      label="I agree to the terms"
                      sx={{ ...styles.checkbox, textAlign: 'center' }}
                    />
                  </motion.div>
                )}

                <FormControl sx={{ ...styles.input, textAlign: 'center' }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Button
                      variant="contained"
                      color={typeOfAuth === 'login' ? 'green' : 'blue'}
                      onClick={handleButtonClick}
                    >
                      {typeOfAuth === 'login' ? 'Login' : 'Sign Up'}
                    </Button>
                  </motion.div>
                </FormControl>

                <FormControl sx={{ ...styles.switch, textAlign: 'center' }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Switch
                      checked={typeOfAuth === 'signup'}
                      onChange={handleChange}
                      color="primary"
                    />
                  </motion.div>
                </FormControl>
              </Box>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Auth;