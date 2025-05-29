import LoginForm from "../../Componentes/Autenticacion/Login"

function LoginForm() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <Layout>
           <Navbar />
              <LoginForm />
        </Layout>
    )
}

export default LoginForm