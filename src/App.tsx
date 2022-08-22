//Componentes de Rotas do próprio react
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import {TutorialPage} from './pages/TutoriaisUsuario';
import Header from './components/HeaderComponent/Header';
import PainelAdmin from './pages/admin/painelAdmin';
import ContasAdmin from './pages/admin/Accounts/AccountsAdmin';
import AddMenuItem from './components/MenuItems/AddMenuItem';
import CookieComponent from './components/CookiesBox/cookies';
import StoreProvider from './components/Storage/Provider';
import ProtectedRoute from './components/Routes/Private/Private';
import { PageFormUser } from './pages/user/formUser';
import PaginaSolicitacaoEnviada from './pages/user/solicitacaoEnviadaPage';
import ChangePasswordPage from './pages/ChangePassword/ChangePasswordPage';
import {MainPage} from './pages/user/paginaPrincipal';
import { LicencesAdmin } from './components/LicencesAdmin';
import {PortalPageClient} from './pages/PortalPageClient';
import {RelatoriosVendasPage} from './pages/user/Relatorios/vendas';
import {CentralDocumentosPageAdmin} from './pages/CentralDocumentos/index';
import {PaginaDocumento} from './pages/PaginaDocumento';
import {NotFound} from './pages/ErrorPage/NotFound';
import {PaginaTutorial} from './pages/TutoriaisUsuario/PaginaTutorial'
import { PaginaChamados } from './pages/PaginaChamados';

function App() {
	//Rotas do React
	//As privadas impedem o acesso caso não esteja logado
	return (
		<BrowserRouter>
			<StoreProvider>
				<Routes>
					<Route path="/" element={<MainPage/>} />
					<Route path="/solicitacao-enviada" element={<PaginaSolicitacaoEnviada />} />
					<Route path="/cadastro" element={<PageFormUser />} />
					<Route path="/login" element={<PageFormUser />} />
					<Route
						path="/user/tutoriais"
						element={
							<ProtectedRoute>
								<Header />
								<TutorialPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/user/change-password"
						element={
							<ProtectedRoute>
								<Header />
								<ChangePasswordPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/user/portal"
						element={
							<ProtectedRoute>
								<Header />
								<PortalPageClient />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/user/relatorios/vendas"
						element={
							<ProtectedRoute>
								<Header />
								<RelatoriosVendasPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/user/documentos"
						element={
							<ProtectedRoute>
								<Header />
								<CentralDocumentosPageAdmin />

							</ProtectedRoute>
						}
					/>
					<Route
						path="/user/documentos/:id"
						element={
							<ProtectedRoute>
								<Header />
								<PaginaDocumento />
							</ProtectedRoute>
						}
						/>
					<Route
						path="/user/tutoriais/:id"
						element={
							<ProtectedRoute>
								<Header />
								<PaginaTutorial />
							</ProtectedRoute>
						}
					/>


					{/* Rotas Admin */}

					<Route
						path="/admin"
						element={
							<ProtectedRoute>
								<Header />
								<PainelAdmin />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/contas"
						element={
							<ProtectedRoute>
								<Header />
								<ContasAdmin />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/menu"
						element={
							<ProtectedRoute>
								<Header />

								<AddMenuItem />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/licencas"
						element={
							<ProtectedRoute>
								<Header />

								<LicencesAdmin />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/admin/documentos"
						element={
							<ProtectedRoute>
								<Header />
								<CentralDocumentosPageAdmin />
							</ProtectedRoute>
						}
					/>
					
					<Route
						path="/admin/documentos/:id"
						element={
							<ProtectedRoute>
								<Header />
								<PaginaDocumento />
							</ProtectedRoute>
						}
						/>
					

					<Route
						path="/admin/change-password"
						element={
							<ProtectedRoute>
								<Header />
								<ChangePasswordPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/admin/tutoriais"
						element={
							<ProtectedRoute>
								<Header />
								<TutorialPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/tutoriais/:id"
						element={
							<ProtectedRoute>
								<Header />
								<PaginaTutorial />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/admin/chamados"
						element={
							<ProtectedRoute>
								<Header />
								<PaginaChamados/>
							</ProtectedRoute>
						}
					/>


					{/*Rotas de Internos*/}

					<Route
						path="/interno/chamados"
						element={
							<ProtectedRoute>
								<Header />
								<PaginaChamados/>
							</ProtectedRoute>
						}
					/>

					<Route
						path="*"
						element={<NotFound />}
					/>
					

					
				</Routes>
			</StoreProvider>

			<CookieComponent />
		</BrowserRouter>
	);
}

export default App;
