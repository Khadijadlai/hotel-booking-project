import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Alert,
  AlertTitle,
  Box,
  Chip,
  Divider,
  Slider,
  Tooltip,
  Fade,
  IconButton
} from "@mui/material";
import {
  Hotel,
  People,
  ChildCare,
  Weekend,
  Bedtime,
  CreditCard,
  TrendingUp,
  Refresh,
  CheckCircle,
  Cancel
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
    },
    secondary: {
      main: "#764ba2",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const [formData, setFormData] = useState({
    adults: 1,
    children: 3,
    babies: 3,
    stays_in_weekend_nights: 2,
    stays_in_week_nights: 3,
    deposit_type: "No Deposit",
    customer_type: "Transient",
    market_segment: "Online TA",
    distribution_channel: "TA/TO"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleSliderChange = (name) => (event, newValue) => {
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData
      );
      setResult(response.data);
    } catch (error) {
      console.error(error);
      setError("Erreur de connexion à l'API. Vérifiez que le serveur est démarré.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setFormData({
      adults: 1,
      children: 3,
      babies: 3,
      stays_in_weekend_nights: 2,
      stays_in_week_nights: 3,
      deposit_type: "No Deposit",
      customer_type: "Transient",
      market_segment: "Online TA",
      distribution_channel: "TA/TO"
    });
    setResult(null);
    setError(null);
  };

  const getProbabilityColor = (probability) => {
    if (probability < 0.3) return "#4caf50";
    if (probability < 0.7) return "#ff9800";
    return "#f44336";
  };

  const getProbabilityMessage = (probability) => {
    if (probability < 0.3) return "Faible risque d'annulation";
    if (probability < 0.7) return "Risque modéré d'annulation";
    return "Risque élevé d'annulation";
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" style={{ marginTop: "40px", marginBottom: "40px" }}>
        {/* En-tête */}
        <Paper
          elevation={0}
          style={{
            padding: "30px",
            marginBottom: "30px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "20px",
            textAlign: "center"
          }}
        >
          <Hotel style={{ fontSize: 50, marginBottom: "10px" }} />
          <Typography variant="h4" style={{ fontWeight: 700, marginBottom: "10px" }}>
            Hotel Booking Prediction
          </Typography>
          <Typography variant="subtitle1">
            Prédiction intelligente des annulations de réservations
          </Typography>
        </Paper>

        {/* Formulaire */}
        <Card elevation={3} style={{ borderRadius: "20px", marginBottom: "20px" }}>
          <CardContent style={{ padding: "30px" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" style={{ fontWeight: 600 }}>
                📋 Informations de réservation
              </Typography>
              <Tooltip title="Réinitialiser">
                <IconButton onClick={handleReset} color="primary">
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>

            <Grid container spacing={3}>
              {/* Adultes */}
              <Grid item xs={12} md={6}>
                <Box mb={2}>
                  <Typography gutterBottom variant="subtitle1">
                    <People style={{ marginRight: "8px", verticalAlign: "middle" }} />
                    Adultes
                  </Typography>
                  <Slider
                    value={formData.adults}
                    onChange={handleSliderChange("adults")}
                    min={0}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                    sx={{ color: "#667eea" }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {formData.adults} adulte{formData.adults > 1 ? "s" : ""}
                  </Typography>
                </Box>
              </Grid>

              {/* Enfants */}
              <Grid item xs={12} md={6}>
                <Box mb={2}>
                  <Typography gutterBottom variant="subtitle1">
                    <ChildCare style={{ marginRight: "8px", verticalAlign: "middle" }} />
                    Enfants
                  </Typography>
                  <Slider
                    value={formData.children}
                    onChange={handleSliderChange("children")}
                    min={0}
                    max={5}
                    marks
                    valueLabelDisplay="auto"
                    sx={{ color: "#667eea" }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {formData.children} enfant{formData.children > 1 ? "s" : ""}
                  </Typography>
                </Box>
              </Grid>

              {/* Bébés */}
              <Grid item xs={12} md={6}>
                <Box mb={2}>
                  <Typography gutterBottom variant="subtitle1">
                    👶 Bébés
                  </Typography>
                  <Slider
                    value={formData.babies}
                    onChange={handleSliderChange("babies")}
                    min={0}
                    max={3}
                    marks
                    valueLabelDisplay="auto"
                    sx={{ color: "#667eea" }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {formData.babies} bébé{formData.babies > 1 ? "s" : ""}
                  </Typography>
                </Box>
              </Grid>

              {/* Nuits week-end */}
              <Grid item xs={12} md={6}>
                <Box mb={2}>
                  <Typography gutterBottom variant="subtitle1">
                    <Weekend style={{ marginRight: "8px", verticalAlign: "middle" }} />
                    Nuits de week-end
                  </Typography>
                  <Slider
                    value={formData.stays_in_weekend_nights}
                    onChange={handleSliderChange("stays_in_weekend_nights")}
                    min={0}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                    sx={{ color: "#667eea" }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {formData.stays_in_weekend_nights} nuit{formData.stays_in_weekend_nights > 1 ? "s" : ""}
                  </Typography>
                </Box>
              </Grid>

              {/* Nuits semaine */}
              <Grid item xs={12} md={6}>
                <Box mb={2}>
                  <Typography gutterBottom variant="subtitle1">
                    <Bedtime style={{ marginRight: "8px", verticalAlign: "middle" }} />
                    Nuits de semaine
                  </Typography>
                  <Slider
                    value={formData.stays_in_week_nights}
                    onChange={handleSliderChange("stays_in_week_nights")}
                    min={0}
                    max={20}
                    marks
                    valueLabelDisplay="auto"
                    sx={{ color: "#667eea" }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {formData.stays_in_week_nights} nuit{formData.stays_in_week_nights > 1 ? "s" : ""}
                  </Typography>
                </Box>
              </Grid>

              {/* Total nuits */}
              <Grid item xs={12} md={6}>
                <Box
                  style={{
                    padding: "10px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "10px",
                    textAlign: "center"
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    Total des nuits
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    {formData.stays_in_weekend_nights + formData.stays_in_week_nights} nuits
                  </Typography>
                </Box>
              </Grid>

              {/* Type de dépôt */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>
                    <CreditCard style={{ marginRight: "5px" }} />
                    Type de dépôt
                  </InputLabel>
                  <Select
                    name="deposit_type"
                    value={formData.deposit_type}
                    onChange={handleChange}
                    label="Type de dépôt"
                  >
                    <MenuItem value="No Deposit">💳 No Deposit</MenuItem>
                    <MenuItem value="Refundable">🔄 Refundable</MenuItem>
                    <MenuItem value="Non Refund">❌ Non Refund</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Type de client */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type de client</InputLabel>
                  <Select
                    name="customer_type"
                    value={formData.customer_type}
                    onChange={handleChange}
                    label="Type de client"
                  >
                    <MenuItem value="Transient">✈️ Transient</MenuItem>
                    <MenuItem value="Contract">📑 Contract</MenuItem>
                    <MenuItem value="Group">👥 Group</MenuItem>
                    <MenuItem value="Transient-Party">🎉 Transient-Party</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Segment de marché */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Segment de marché</InputLabel>
                  <Select
                    name="market_segment"
                    value={formData.market_segment}
                    onChange={handleChange}
                    label="Segment de marché"
                  >
                    <MenuItem value="Online TA">💻 Online TA</MenuItem>
                    <MenuItem value="Offline TA/TO">🏢 Offline TA/TO</MenuItem>
                    <MenuItem value="Direct">📞 Direct</MenuItem>
                    <MenuItem value="Corporate">💼 Corporate</MenuItem>
                    <MenuItem value="Complementary">🎁 Complementary</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Canal de distribution */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Canal de distribution</InputLabel>
                  <Select
                    name="distribution_channel"
                    value={formData.distribution_channel}
                    onChange={handleChange}
                    label="Canal de distribution"
                  >
                    <MenuItem value="TA/TO">🌐 TA/TO</MenuItem>
                    <MenuItem value="Direct">📞 Direct</MenuItem>
                    <MenuItem value="Corporate">💼 Corporate</MenuItem>
                    <MenuItem value="GDS">🖥️ GDS</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider style={{ margin: "30px 0 20px" }} />

            {/* Bouton de prédiction */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                padding: "12px",
                fontSize: "1.1rem",
                fontWeight: 600
              }}
            >
              {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : <><TrendingUp /> Prédire</>}
            </Button>
          </CardContent>
        </Card>

        {/* Erreur */}
        {error && (
          <Alert severity="error" style={{ borderRadius: "12px", marginBottom: "20px" }}>
            <AlertTitle>Erreur</AlertTitle>
            {error}
          </Alert>
        )}

        {/* Résultat */}
        {result && (
          <Fade in={!!result}>
            <Card elevation={3} style={{ borderRadius: "20px" }}>
              <CardContent style={{ padding: "30px" }}>
                <Typography variant="h5" gutterBottom align="center" style={{ fontWeight: 600 }}>
                  📊 Résultat
                </Typography>
                
                <Divider style={{ marginBottom: "20px" }} />

                {/* Prédiction */}
                <Box textAlign="center" mb={3}>
                  <Chip
                    label={result.prediction === 1 ? "Annulation probable" : "Pas d'annulation"}
                    style={{
                      backgroundColor: result.prediction === 1 ? "#f44336" : "#4caf50",
                      color: "white",
                      fontSize: "1rem",
                      padding: "5px 10px",
                      height: "auto"
                    }}
                    icon={result.prediction === 1 ? <Cancel /> : <CheckCircle />}
                  />
                </Box>

                {/* Probabilité */}
                <Box textAlign="center" mb={3}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Probabilité d'annulation
                  </Typography>
               <Typography
  variant="h1"
  style={{
    color: getProbabilityColor(result.probability / 100), // Ajuster aussi ici
    fontWeight: 700,
    fontSize: "4rem"
  }}
>
  {result.probability.toFixed(1)}%  {/* Supprimer * 100 */}
</Typography>
                  <Chip
                    label={getProbabilityMessage(result.probability)}
                    style={{
                      marginTop: "10px",
                      backgroundColor: getProbabilityColor(result.probability),
                      color: "white"
                    }}
                  />
                </Box>

                {/* Barre de progression */}
                <Box mb={3}>
                  <Box
                    style={{
                      height: "10px",
                      backgroundColor: "#e0e0e0",
                      borderRadius: "5px",
                      overflow: "hidden"
                    }}
                  >
                    <Box
                      style={{
                        width: `${result.probability * 100}%`,
                        height: "100%",
                        backgroundColor: getProbabilityColor(result.probability),
                        transition: "width 0.5s ease"
                      }}
                    />
                  </Box>
                </Box>

                {/* Message détaillé */}
                <Alert
                  severity={result.prediction === 1 ? "warning" : "success"}
                  style={{ borderRadius: "12px" }}
                >
                  <AlertTitle>
                    {result.prediction === 1 ? "⚠️ Attention" : "✅ Bonne nouvelle"}
                  </AlertTitle>
                  {result.prediction === 1
                    ? "Ce client présente un risque élevé d'annulation. Une attention particulière est recommandée."
                    : "Ce client a une faible probabilité d'annuler sa réservation."}
                </Alert>

                {/* Résumé des données */}
                <Box mt={3}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Résumé de la réservation
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        👥 {formData.adults + formData.children + formData.babies} personnes
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        📅 {formData.stays_in_weekend_nights + formData.stays_in_week_nights} nuits
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        💳 {formData.deposit_type}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        🏷️ {formData.customer_type}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;