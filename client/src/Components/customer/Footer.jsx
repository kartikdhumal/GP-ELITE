import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <section className="bg-black">
            <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
                <div className="flex justify-center mt-8 space-x-6">
                    <span className="text-sky-100 hover:text-sky-200">
                        <span className="sr-only">Linkedin</span>
                        <div className="w-6 h-6">
                            <Link href="https://kartikdhumal.vercel.app" className='font-bold' target="_blank">
                                <LinkedInIcon />
                            </Link>
                        </div>
                    </span>
                    <div className="text-sky-100 hover:text-sky-200">
                        <span className="sr-only">Instagram</span>
                        <div className="w-6 h-6">
                            <Link href="https://www.instagram.com/kartik_dhumal._/" className='font-bold' target="_blank">
                                <InstagramIcon />
                            </Link>
                        </div>
                    </div>
                    <span className="text-sky-100 hover:text-sky-200">
                        <span className="sr-only">GitHub</span>
                        <div className="w-6 h-6">
                            <Link href="https://github.com/kartikdhumal/kartikdhumal" className='font-bold' target="_blank">
                                <GitHubIcon />
                            </Link>
                        </div>
                    </span>
                </div>
                <p className="text-base leading-6 text-center text-sky-100">
                    ©2025 GP Elite, Inc. All rights reserved.
                </p>
                <p className="text-base text-center text-sky-100">
                    Developed by <Link href="https://kartikdhumal.vercel.app" className='font-bold' target="_blank">Kartik Dhumal</Link>
                </p>
            </div>
        </section>
    )
}

export default Footer
