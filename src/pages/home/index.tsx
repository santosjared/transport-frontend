// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const Home = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Transporte publico de microbuses 🚌'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>Transporte publico de microbuses </Typography>
            <Typography>
             Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestias, vero! At excepturi et id ab. Exercitationem, 
             optio suscipit! Ex, est! Hic, sunt. Ipsum voluptatibus rem cum veritatis nemo. Fugiat, similique!
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Aqui se mostraran las rutas 🚧'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>
              recuperados de la base de datos.
            </Typography>
            <Typography>descrioción.
              {/* <Conect></Conect> */}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Home
