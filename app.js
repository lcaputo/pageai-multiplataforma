const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 80;

app.use(express.json());
const secretKey = "tuClaveSecreta"; // Reemplaza esto con tu clave secreta para firmar el token

const prisma = new PrismaClient();

// Script para verificar y crear la base de datos SQLite si no existe
async function initializeDatabase() {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

initializeDatabase();

app.options("*", cors());

// Registro de usuario
app.post("/registro", cors(), async (req, res) => {
  const { email, password, name, roles } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await prisma.Users.create({
      data: {
        email,
        name,
        password: hashedPassword,
        roles: {
          connect: roles.map((role) => ({ id: role })),
        },
      },
      include: {
        roles: true,
      },
    });
    return res.json(usuario);
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).send("Error en el servidor");
  }
});

// Login de usuario
app.post("/login", cors(), async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await prisma.Users.findUnique({
      where: {
        email,
      },
      include: {
        roles: true,
      },
    });

    if (!usuario) {
      res.status(401).send("Credenciales incorrectas");
      return;
    }

    const passwordMatch = await bcrypt.compare(password, usuario.password);

    if (passwordMatch) {
      // Generar token JWT
      const token = jwt.sign(
        { userId: usuario.id, roles: usuario.roles },
        secretKey,
        {
          expiresIn: "1h",
          algorithm: "HS256",
        }
      );

      // Enviar el token como respuesta
      res.json({ token });
    } else {
      res.status(401).send("Credenciales incorrectas");
    }
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).send("Error en el servidor");
  }
});

app.get("/users", cors(), async (req, res) => {
  try {
    const usuarios = await prisma.Users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).send("Error en el servidor");
  }
});

app.get("/users/:id", cors(), async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.Users.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!usuario) {
      res.status(404).send("Usuario no encontrado");
      return;
    }

    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).send("Error en el servidor");
  }
});

app.put("/users/:id", cors(), async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const usuario = await prisma.Users.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        email,
      },
    });

    res.json(usuario);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).send("Error en el servidor");
  }
});

app.delete("/users/:id", cors(), async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.Users.delete({
      where: {
        id: Number(id),
      },
    });

    res.send("Usuario eliminado");
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).send("Error en el servidor");
  }
});

// Ruta protegida
app.get("/ruta-protegida", (req, res) => {
  // Verificar el token en la cabecera de autorización
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).send("Acceso no autorizado");
    return;
  }
  // Verificar y decodificar el token
  jwt.verify(
    token.split(" ")[1],
    secretKey,
    { algorithms: ["HS256"] },
    (err, decoded) => {
      if (err) {
        console.log(err);
        res.status(401).send("Token no válido");
        return;
      }

      // El token es válido, continuar con la lógica de la ruta protegida
      res.json({
        mensaje: "Esta es una ruta protegida",
        usuarioId: decoded.id,
      });
    }
  );
});

// list Posts
app.get("/posts", cors(), async (req, res) => {
  try {
    const posts = await prisma.Posts.findMany({
      select: {
        id: true,
        city: true,
        price: true,
        address: true,
        numOfBedrooms: true,
        numOfBathrooms: true,
        provice: true,
        Population: true,
        longitude: true,
        latitude: true,
        userId: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.json(posts);
  } catch (error) {
    console.error("Error al obtener los posts:", error);
    res.status(500).send("Error en el servidor");
  }
});

// create Post
app.post("/posts", cors(), async (req, res) => {
  const { city, price, address, numOfBedrooms, numOfBathrooms, provice, Population, longitude, latitude, userId } = req.body;

  try {
    const post = await prisma.Posts.create({
      data: {
        city,
        price,
        address,
        numOfBedrooms,
        numOfBathrooms,
        provice,
        Population,
        longitude,
        latitude,
        userId,
      },
    });
    return res.json(post);
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).send("Error en el servidor");
  }
});

// get by id
app.get("/posts/:id", cors(), async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.Posts.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        city: true,
        price: true,
        address: true,
        numOfBedrooms: true,
        numOfBathrooms: true,
        provice: true,
        Population: true,
        longitude: true,
        latitude: true,
        userId: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!post) {
      res.status(404).send("Post no encontrado");
      return;
    }

    res.json(post);
  } catch (error) {
    console.error("Error al obtener el post:", error);
    res.status(500).send("Error en el servidor");
  }
});

// update Post
app.patch("/posts/:id", cors(), async (req, res) => {
  const { id } = req.params;
  const { city, price, address, numOfBedrooms, numOfBathrooms, provice, Population, longitude, latitude, userId } = req.body;

  try {
    const post = await prisma.Posts.update({
      where: {
        id: Number(id),
      },
      data: {
        city,
        price,
        address,
        numOfBedrooms,
        numOfBathrooms,
        provice,
        Population,
        longitude,
        latitude,
        userId,
      },
    });

    res.json(post);
  } catch (error) {
    console.error("Error al actualizar el post:", error);
    res.status(500).send("Error en el servidor");
  }
});

// delete Post
app.delete("/posts/:id", cors(), async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.Posts.delete({
      where: {
        id: Number(id),
      },
    });

    res.send("Post eliminado");
  } catch (error) {
    console.error("Error al eliminar el post:", error);
    res.status(500).send("Error en el servidor");
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
