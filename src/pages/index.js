import React, { useState } from "react";
import { Link} from "react-router-dom";
import theme from "theme";
import { Theme, Text, List, Box, Section, Link as QLink} from "@quarkly/widgets";
import { Helmet } from "react-helmet";
import { GlobalQuarklyPageStyles } from "global-page-styles";
import { RawHtml } from "@quarkly/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import axios from 'axios';

const Index = () => {
	const [showPassword, setShowPassword] = useState(false);
  const [rippleList, setRippleList] = useState([]);
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const elem = document.getElementsByClassName("err")[0]

  async function loginuser(event) {
	event.preventDefault()

	const response = await fetch(`http://${window.location.hostname}/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email,
			password,
		}),
	})

	const data = await response.json()

	if (data.user) {
		setIsLoggedIn(true);
		localStorage.setItem('token', data.user);
		elem.style.display="none"
		window.location.href = '/home';
	  } else {
		elem.style.display="block"
	  }
}

  const createRipple = (e) => {
    const button = e.currentTarget;
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const newRipple = {
      left: e.clientX - button.getBoundingClientRect().left - radius + "px",
      top: e.clientY - button.getBoundingClientRect().top - radius + "px",
      diameter: diameter + "px"
    };

    setRippleList((prevRipples) => [...prevRipples, newRipple]);
  };



	return(
		 <Theme theme={theme}>
		<GlobalQuarklyPageStyles pageUrl={"login"} />
		<Helmet>
			<title>
				Login - JJ
			</title>
			<meta name={"description"} content={"Web site created using quarkly.io"} />
			<link rel={"shortcut icon"} href={"http://uploads.quarkly.io/readme/cra/favicon-32x32.ico"} type={"image/x-icon"} />
			<link rel={"preconnect"} href={"http://fonts.googleapis.com"}/>
			<link rel={"preconnect"} href={"http://fonts.gstatic.com"} crossorigin/>
			<link href={"http://fonts.googleapis.com/css2?family=Diphylleia&family=Teko&display=swap"} rel={"stylesheet"}/>
		</Helmet>
		<Section padding="0px 0 0px 0">
			<Box
				display="flex"
				padding="12px 0"
				justify-content="space-between"
				align-items="center"
				flex-direction="row"
				md-flex-direction="column"
			>
				<Text margin="0" md-margin="0px 0 20px 0" text-align="left" font="normal 900 50px/1.5 --fontFamily-googleTeko">
					Journey Diaries
				</Text>
				<Link to="/" color="#000000" />
				<List
					margin="0px 0px 0px 0px"
					padding="0px 0px 0px 20px"
					as="ul"
					list-style-type="none"
					flex="0 1 auto"
					order="1"
					display="flex"
				>
					<Link
						to="/"
						className="nl"
					>
						Home
					</Link>
					<Link
						to="/"
						className="nl"
					>
						About
					</Link>
					<Link
						to="/index"
						className="navbtn"
					>
						LOGIN
					</Link>
					<Link
						to="/signup"
						className="navbtn"
					>
						REGISTER
					</Link>
				</List>
			</Box>
		</Section>
		<Section background="url(http://cdn.pixabay.com/photo/2018/11/17/07/10/notebook-3820634_1280.jpg) 20% 15%/cover" padding="60px 0" sm-padding="40px 0" height="556px">
  			<Box
    			display="flex"
    			justify-content="center"
    			align-items="center"
    			height="100%"
  			>
    		<form onSubmit={loginuser}>
				
      		<Box
        		display="flex"
        		flex-direction="column"
        		padding="40px"
        	border-radius="8px"
        	width="400px"
			className="frmbox"
      		>
			<label className="head1">Login</label>
			<label className="mail">Email</label>
        	<input
          	type="email"
          	placeholder="Email"
          	margin-bottom="20px"
          	padding="10px"
          	border-radius="4px"
          	border="1px solid #cccccc"
			className="mailin"
			opacity="1"
			value={email}
			onChange={(e)=>setEmail(e.target.value)}
        	/>
			<label className="pass">Password</label>
      <div className="passcon">
        	<input
          	type={showPassword ? "text" : "password"}
          	placeholder="Password"
          	margin-bottom="20px"
          	padding="10px"
          	border-radius="4px"
          	border="1px solid #cccccc"
			height={"200"}
			opacity="1"
			className="passe"
			value={password}
			onChange={(e)=>setPassword(e.target.value)}
        	/>
			<FontAwesomeIcon
  icon={showPassword ? faEye : faEyeSlash}
  size="lg"
  color="#818181"
  onClick={() => setShowPassword((prevShowPassword) => !prevShowPassword)}
  className="icon visible-icon"
/>
</div>
<label className="err">Invalid Credentials</label>

        	<button
        type="submit"
        className="ripple-btn"
        onClick={createRipple}
		value="Login"
      >
        Login
        {rippleList.map((ripple, index) => (
          <span
            key={index}
            style={{
              width: ripple.diameter,
              height: ripple.diameter,
              left: ripple.left,
              top: ripple.top
            }}
            className="ripple"
          />
        ))}
      </button>
	  <label className="lnk">New User? <Link to="/signup" className="reglnk">Register</Link></label>
	  <label className="lnk reset"><Link to="/reset" className="reglnk">Forgot Password</Link></label>
      		</Box>
    		</form>
  			</Box>
		</Section>

		<Section background-color="--dark" text-align="center" padding="32px 0" quarkly-title="Footer-1">
			<List
				margin="0px 0px 0px 0px"
				padding="12px 0px 12px 0px"
				list-style-type="none"
				as="ul"
				display="flex"
				align-items="center"
				justify-content="center"
			>
				<Link
					to="/"
					className="nl1"
				>
					About
				</Link>
				<Link
					to="/"
					className="nl1"
				>
					Services
				</Link>
				<Link
					to="/"
					className="nl1"
				>
					Contacts
				</Link>
			</List>
			<QLink
				href="mailto:hello@company.com"
				text-decoration-line="none"
				variant="--base"
				color="--grey"
				hover-color="--primary"
			>
				hello@company.com
			</QLink>
		</Section>
		<RawHtml>
			<style place={"endOfHead"} rawKey={"6495169491dc65001840fcad"}>
				{":root {\n  box-sizing: border-box;\n}\n\n* {\n  box-sizing: inherit;\n}"}
			</style>
		</RawHtml>
	</Theme>);
};

export default Index;
