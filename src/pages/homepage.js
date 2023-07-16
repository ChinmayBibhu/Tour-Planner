import React, { useState,useEffect } from "react";
import theme from "theme";
import { Theme, Link as QLink, Text, List, Box, Section, Icon } from "@quarkly/widgets";
import { Helmet } from "react-helmet";
import { GlobalQuarklyPageStyles } from "global-page-styles";
import { RawHtml } from "@quarkly/components";
import { FaPen, FaClipboardList, FaFileArchive } from "react-icons/fa";
import {Link,useHistory } from "react-router-dom";
import "./home.css";
import "./index.css";
import axios from 'axios';

export default (() => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const history = useHistory();
    const token = localStorage.getItem('token') || '';

    useEffect(() => {
        fetch(`http://${window.location.hostname}/posts`, {
          headers: {
            'x-access-token': token,
          },
        })
          .then((response) => response.json())
      }, [token]);

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        history.replace('/index');
      };

	return <Theme theme={theme}>
		<GlobalQuarklyPageStyles pageUrl={"index"} />
		<Helmet>
			<title>
				HomePage - JJ
			</title>
			<link rel={"shortcut icon"} href={"http://uploads.quarkly.io/readme/cra/favicon-32x32.ico"} type={"image/x-icon"} />
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
				<Link to="#" color="#000000" />
				<List
            margin="0px 0px 0px 0px"
            padding="0px 0px 0px 20px"
            as="ul"
            list-style-type="none"
            flex="0 1 auto"
            order="1"
            display="flex"
          >
            <Link to="/home" className="nl">
              Home
            </Link>
            <Link to="/bucket" className="nl">
              Bucket
            </Link>
            <Link to="/make" className="nl">
              Create
            </Link>
            <Link to="/cards" className="nl">
              Prev. Notes
            </Link>
            <Link to="/" className="navbtn" onClick={handleLogout}>
              Logout
            </Link>
          </List>
			</Box>
		</Section>
		<Section padding="100px 0 100px 0" background="url(http://cdn.pixabay.com/photo/2018/11/17/07/10/notebook-3820634_1280.jpg) 0% 0%/cover no-repeat,#EDF2F6" sm-padding="60px 0 60px 0">
			<Box display="grid" grid-template-columns="repeat(3, 1fr)" grid-gap="32px 4%" md-grid-template-columns="1fr" filter="brightness(80%)">
				<Link to="/make" className="cl">
                <Box
					padding="45px 45px"
					lg-padding="45px 30px"
					md-padding="45px 45px"
					background="#FFFFFF"
					border-radius="24px"
					justify-content="flex-start"
					flex-direction="column"
					display="flex"
					opacity="0.5"
					hover-opacity="1"
					hover-transform="skew(0deg, 0deg)"
					hover-mix-blend-mode="normal"
					mix-blend-mode="screen"
					md-opacity="1"
					md-mix-blend-mode="normal"
				>
					<Icon
						category="fa"
						icon={FaPen}
						margin="0px 0px 30px 0px"
						color="--dark"
						size="48px"
					/>
					<Text margin="0px 0px 18px 0px" color="--darkL2" font="--headline3" lg-text-align="left">
						Create
					</Text>
				</Box>
                </Link>
				<Link to="/bucket" className="cl">
                <Box
					padding="45px 45px"
					lg-padding="45px 30px"
					md-padding="45px 45px"
					background="#FFFFFF"
					border-radius="24px"
					justify-content="flex-start"
					flex-direction="column"
					display="flex"
					opacity="0.5"
					mix-blend-mode="screen"
					hover-opacity="1"
					hover-mix-blend-mode="normal"
					md-opacity="1"
					md-mix-blend-mode="normal"
				>
					<Icon
						category="fa"
						icon={FaClipboardList}
						margin="0px 0px 30px 0px"
						color="--dark"
						size="48px"
					/>
					<Text margin="0px 0px 18px 0px" color="--darkL2" font="--headline3" lg-text-align="left">
						Bucket List
					</Text>
				</Box>
                </Link>
				<Link to="/cards" className="cl">
                <Box
					padding="45px 45px"
					lg-padding="45px 30px"
					md-padding="45px 45px"
					background="#FFFFFF"
					border-radius="24px"
					justify-content="flex-start"
					flex-direction="column"
					display="flex"
					mix-blend-mode="screen"
					opacity="0.5"
					hover-opacity="1"
					hover-mix-blend-mode="normal"
					md-opacity="1"
					md-mix-blend-mode="normal"
				>
					<Icon
						category="fa"
						icon={FaFileArchive}
						margin="0px 0px 30px 0px"
						color="--dark"
						size="48px"
					/>
					<Text margin="0px 0px 18px 0px" color="--darkL2" font="--headline3" lg-text-align="left">
						Your Notes
					</Text>
				</Box>
                </Link>
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
			<style place={"endOfHead"} rawKey={"64948d1991dc65001840fab9"}>
				{":root {\n  box-sizing: border-box;\n}\n\n* {\n  box-sizing: inherit;\n}"}
			</style>
		</RawHtml>
	</Theme>;
});
