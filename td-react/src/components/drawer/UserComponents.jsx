import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';

// Theme configuration
const lightTheme = {
  background: '#f8f9fa',
  text: '#2c3e50',
  cardBackground: 'white',
  borderColor: '#e9ecef',
  headerBackground: '#f8f9fa',
  inputBackground: 'white',
  inputBorder: '#e2e8f0',
  buttonText: '#4a5568',
  buttonBackground: '#e2e8f0',
  errorBackground: '#fff5f5',
  errorBorder: '#feb2b2',
  errorText: '#c53030'
};

const darkTheme = {
  background: '#1a202c',
  text: '#e2e8f0',
  cardBackground: '#2d3748',
  borderColor: '#4a5568',
  headerBackground: '#2d3748',
  inputBackground: '#2d3748',
  inputBorder: '#4a5568',
  buttonText: '#e2e8f0',
  buttonBackground: '#4a5568',
  errorBackground: '#742a2a',
  errorBorder: '#9b2c2c',
  errorText: '#feb2b2'
};

// Theme context
const ThemeContext = React.createContext();

const Container = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.background};
  min-height: 100vh;
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
`;

const ThemeToggle = styled.button`
  position: fixed;
  top: 50px;
  right: 20px;
  padding: 10px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.borderColor};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: ${props => props.theme.text};
  margin: 0;
  font-weight: 600;
`;

const StyledButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const AddButton = styled(StyledButton)`
  background-color: #3498db;
  color: white;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const TableContainer = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const Th = styled.th`
  background-color: ${props => props.theme.headerBackground};
  color: ${props => props.theme.text};
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid ${props => props.theme.borderColor};
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.borderColor};
  color: ${props => props.theme.text};
  vertical-align: middle;
`;

const Badge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.875rem;
  text-transform: capitalize;
  
  ${props => {
    switch (props.type) {
      case 'admin':
        return 'background-color: #fed7d7; color: #c53030;';
      case 'manager':
        return 'background-color: #c6f6d5; color: #2f855a;';
      default:
        return 'background-color: #bee3f8; color: #2b6cb0;';
    }
  }}
`;

const ActionButton = styled(StyledButton)`
  ${props => props.variant === 'edit' 
    ? 'background-color: #f6e05e; color: #744210;'
    : 'background-color: #feb2b2; color: #c53030;'
  }

  &:hover {
    ${props => props.variant === 'edit'
      ? 'background-color: #ecc94b;'
      : 'background-color: #fc8181;'
    }
  }
`;

const Dialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: ${props => props.theme.text};
`;

const DialogHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.borderColor};
`;

const DialogBody = styled.div`
  padding: 1.5rem;
`;

const DialogFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${props => props.theme.borderColor};
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.inputBorder};
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.inputBorder};
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
    outline: none;
  }
`;

const Switch = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  background-color: ${props => props.theme.errorBackground};
  border: 1px solid ${props => props.theme.errorBorder};
  color: ${props => props.theme.errorText};
  border-radius: 8px;
`;

const UserManagement = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
    fetchUsers();
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8010/api/users/');
      setUsers(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des utilisateurs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      role: '',
      password: ''
    });
    setCurrentUser(null);
    setError('');
  };

  const handleAddUser = () => {
    resetForm();
    setShowDialog(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      password: ''
    });
    setShowDialog(true);
  };

  const handleSaveUser = async () => {
    try {
      setLoading(true);
      setError('');
      
      const userData = { ...formData };
      if (!userData.password) {
        delete userData.password;
      }

      if (currentUser) {
        await axios.put(`http://localhost:8010/api/users/${currentUser._id}`, userData);
      } else {
        await axios.post('http://localhost:8010/api/users/', userData);
      }

      await fetchUsers();
      setShowDialog(false);
      resetForm();
    } catch (error) {
      setError('Erreur lors de la sauvegarde de l\'utilisateur');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:8010/api/users/${userId}`);
      await fetchUsers();
    } catch (error) {
      setError('Erreur lors de la suppression de l\'utilisateur');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerification = async (userId, currentStatus) => {
    try {
      setLoading(true);
      await axios.patch(`http://localhost:8010/api/users/${userId}/verify`);
      await fetchUsers();
    } catch (error) {
      setError('Erreur lors de la modification du statut de vérification');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  if (loading && !users.length) {
    return <Container theme={theme} style={{ textAlign: 'center' }}>Chargement...</Container>;
  }

  return (
    <ThemeContext.Provider value={theme}>
      <Container theme={theme}>
       
        
        <Header>
          <Title theme={theme}>Gestion des utilisateurs</Title>
        
          <ThemeToggle onClick={toggleTheme} theme={theme}>
          {isDarkMode ? '☀️' : '🌙'}
          
        </ThemeToggle>
        </Header>

        {error && (
          <ErrorMessage theme={theme}>
            {error}
          </ErrorMessage>
        )}

        <TableContainer theme={theme}>
          <StyledTable>
            <thead>
              <tr>
                {['Nom', 'Email', 'Rôle', 'Vérifié', 'Actions'].map((header) => (
                  <Th key={header} theme={theme}>{header}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <Td theme={theme}>
                    {user.firstName} {user.lastName}
                  </Td>
                  <Td theme={theme}>{user.email}</Td>
                  <Td theme={theme}>
                    <Badge type={user.role}>{user.role}</Badge>
                  </Td>
                  <Td theme={theme}>
                    <Switch>
                      <input
                        type="checkbox"
                        checked={user.isVerified}
                        onChange={() => handleToggleVerification(user._id, user.isVerified)}
                      />
                    </Switch>
                  </Td>
                  <Td theme={theme}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <ActionButton
                        variant="edit"
                        onClick={() => handleEditUser(user)}
                      >
                        Modifier
                      </ActionButton>
                      <ActionButton
                        variant="delete"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Supprimer
                      </ActionButton>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>

        {showDialog && (
          <Dialog>
            <DialogContent theme={theme}>
              <DialogHeader theme={theme}>
                <Title theme={theme} style={{ fontSize: '1.25rem' }}>
                  {currentUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
                </Title>
              </DialogHeader>
              <DialogBody>
                <form>
                  {[
                    { name: 'email', label: 'Email', type: 'email' },
                    { name: 'firstName', label: 'Prénom', type: 'text' },
                    { name: 'lastName', label: 'Nom', type: 'text' }
                  ].map((field) => (
                    <FormGroup key={field.name}>
                      <Label theme={theme}>{field.label}</Label>
                      <Input
                        type={field.type}
                        name={field.name}
                        placeholder={`Entrez ${field.label.toLowerCase()}`}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        theme={theme}
                      />
                    </FormGroup>
                  ))}

                  <FormGroup>
                    <Label theme={theme}>Rôle</Label>
                    <Select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      theme={theme}
                    >
                      <option value="">Sélectionnez un rôle</option>
                      <option value="user">Utilisateur</option>
                      <option value="admin">Administrateur</option>
                      <option value="manager">Manager</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label theme={theme}>
                      {currentUser ? 'Nouveau mot de passe (laisser vide pour ne pas modifier)' : 'Mot de passe'}
                    </Label>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Entrez le mot de passe"
                      value={formData.password}
                      onChange={handleInputChange}
                      theme={theme}
                    />
                  </FormGroup>
                </form>
              </DialogBody>
              <DialogFooter theme={theme}>
                <StyledButton 
                  onClick={() => setShowDialog(false)}
                  style={{ 
                    backgroundColor: theme.buttonBackground, 
                    color: theme.buttonText 
                  }}
                >
                  Annuler
                </StyledButton>
                <StyledButton
                  onClick={handleSaveUser}
                  disabled={loading}
                  style={{ backgroundColor: '#3498db', color: 'white' }}
                >
                  {loading ? 'Chargement...' : (currentUser ? 'Mettre à jour' : 'Ajouter')}
                </StyledButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </Container>
    </ThemeContext.Provider>
  );
};

export default UserManagement;