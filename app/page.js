"use client";

import Head from "next/head";

export default function Home() {
	return (
		<>
			<Head>
				<title>
					Dirgantara Restaurant - Fine Dining dengan Sentuhan
					Nusantara
				</title>
				<meta
					name="description"
					content="Restaurant elegan dengan menu modern berbahan dasar tradisional Indonesia"
				/>
			</Head>

			{/* Hero Section */}
			<section className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
				<div className="absolute inset-0 bg-black opacity-50"></div>
				<div className="relative z-10 text-center px-4">
					<h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
						<span className="text-yellow-400">
							Dirgantara
						</span>{" "}
						Restaurant
					</h1>
					<p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
						Pengalaman kuliner tinggi dengan cita rasa
						Nusantara yang autentik
					</p>
					<div className="flex gap-4 justify-center">
						<button
							onClick={() =>
								(window.location.href = "/login")
							}
							className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
						>
							Login
						</button>
						<button
							onClick={() =>
								(window.location.href = "/register")
							}
							className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold py-3 px-6 rounded-full transition-all duration-300"
						>
							Register
						</button>
					</div>
				</div>

				<div className="absolute bottom-10 left-0 right-0 flex justify-center">
					<svg
						className="animate-bounce w-8 h-8 text-white"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M19 14l-7 7m0 0l-7-7m7 7V3"
						></path>
					</svg>
				</div>
			</section>

			{/* Keunggulan Restaurant */}
			<section className="py-20 bg-gradient-to-b from-gray-900 to-black text-white">
				<div className="container mx-auto px-4">
					<h2 className="text-4xl font-bold text-center mb-16">
						Mengapa Memilih{" "}
						<span className="text-yellow-400">
							Dirgantara
						</span>
						?
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
						<div className="bg-gray-800 p-8 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
							<div className="text-yellow-400 text-5xl mb-4">
								✈️
							</div>
							<h3 className="text-2xl font-bold mb-3">
								Konsep Unik
							</h3>
							<p className="text-gray-300">
								Interior bertema penerbangan dengan
								sentuhan modern dan elemen tradisional
								Indonesia.
							</p>
						</div>

						<div className="bg-gray-800 p-8 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
							<div className="text-yellow-400 text-5xl mb-4">
								👨‍🍳
							</div>
							<h3 className="text-2xl font-bold mb-3">
								Chef Berpengalaman
							</h3>
							<p className="text-gray-300">
								Dibimbing oleh chef dengan pengalaman
								15+ tahun di restoran bintang Michelin.
							</p>
						</div>

						<div className="bg-gray-800 p-8 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
							<div className="text-yellow-400 text-5xl mb-4">
								🌿
							</div>
							<h3 className="text-2xl font-bold mb-3">
								Bahan Premium
							</h3>
							<p className="text-gray-300">
								Bahan-bahan pilihan langsung dari petani
								dan produsen lokal terbaik.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonial */}
			<section className="py-20 bg-gradient-to-r from-gray-900 to-black">
				<div className="container mx-auto px-4">
					<h2 className="text-4xl font-bold text-center mb-16 text-white">
						Kata{" "}
						<span className="text-yellow-400">Mereka</span>{" "}
						Tentang Kami
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="bg-gray-800 p-8 rounded-xl">
							<div className="flex items-center mb-4">
								<div className="text-yellow-400 text-2xl mr-2">
									★★★★★
								</div>
							</div>
							<p className="text-gray-300 italic mb-6">
								"Pengalaman makan terbaik yang pernah
								saya rasakan! Nuansa restoran yang unik
								dipadukan dengan rasa makanan yang luar
								biasa. Beef Rendang-nya benar-benar
								spesial."
							</p>
							<div className="flex items-center">
								<div className="w-12 h-12 rounded-full bg-gray-700 mr-4"></div>
								<div>
									<h4 className="font-bold text-white">
										Andi Wijaya
									</h4>
									<p className="text-gray-400">
										Food Blogger
									</p>
								</div>
							</div>
						</div>

						<div className="bg-gray-800 p-8 rounded-xl">
							<div className="flex items-center mb-4">
								<div className="text-yellow-400 text-2xl mr-2">
									★★★★☆
								</div>
							</div>
							<p className="text-gray-300 italic mb-6">
								"Konsepnya sangat kreatif dan
								eksekusinya sempurna. Dessert
								Skyline-nya tidak hanya indah dipandang
								tapi juga lezat. Pelayannya sangat
								profesional dan ramah."
							</p>
							<div className="flex items-center">
								<div className="w-12 h-12 rounded-full bg-gray-700 mr-4"></div>
								<div>
									<h4 className="font-bold text-white">
										Sarah Dewi
									</h4>
									<p className="text-gray-400">
										Travel Influencer
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-yellow-500 text-black">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl md:text-4xl font-bold mb-6">
						Siap untuk Pengalaman Kuliner yang Tak Terlupakan?
					</h2>
					<p className="text-xl mb-8 max-w-2xl mx-auto">
						Reservasi sekarang dan dapatkan pengalaman makan
						terbaik dengan sentuhan kelas dunia
					</p>
					<button
						onClick={() =>
							(window.location.href = "/product")
						}
						className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full transition-all duration-300"
					>
						Lihat Menu
					</button>
				</div>
			</section>
		</>
	);
}
